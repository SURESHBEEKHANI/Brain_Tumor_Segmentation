# app.py
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import StreamingResponse
from ultralytics import YOLO
from PIL import Image
import io
import numpy as np

# Initialize FastAPI app
app = FastAPI(title="Brain Tumor Segmentation API")

# Load YOLO model once
try:
    model = YOLO("model/best.pt")  # Update path if needed
except Exception as e:
    raise RuntimeError(f"Failed to load YOLO model: {e}")


def predict_tumor(image: Image.Image) -> Image.Image:
    """Predict tumor and return image with overlayed segmentation mask"""
    try:
        # Convert PIL to NumPy array for YOLO
        image_np = np.array(image)
        results = model.predict(image_np)
        output_image = results[0].plot()  # Get annotated image
        return Image.fromarray(output_image)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction Error: {e}")


@app.get("/")
def read_root():
    return {"message": "Brain Tumor Segmentation API is running."}


@app.post("/predict/")
async def predict(file: UploadFile = File(...)):
    """Upload an MRI image and get tumor segmentation"""
    try:
        image = Image.open(io.BytesIO(await file.read())).convert("RGB")
        segmented_image = predict_tumor(image)

        # Convert PIL image to bytes
        img_byte_arr = io.BytesIO()
        segmented_image.save(img_byte_arr, format="PNG")
        img_byte_arr.seek(0)

        return StreamingResponse(img_byte_arr, media_type="image/png")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    # Auto-reload for development
    uvicorn.run(
        "app:app",  # matches this file name
        host="0.0.0.0",
        port=8000,
        reload=True
    )
