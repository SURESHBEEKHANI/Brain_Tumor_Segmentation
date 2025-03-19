import streamlit as st
from ultralytics import YOLO
from PIL import Image
import torchvision.transforms as transforms
import base64

# Set Streamlit Page Configuration
st.set_page_config(
    page_title="Brain Tumor Segmentation",
    page_icon="logo/logo.png",
    layout="centered"
)

# Cache the YOLO model to avoid reloading on every interaction
@st.cache_resource()
def load_model():
    return YOLO("model/best.pt")  # Update path if needed

model = load_model()

# Define image transformation pipeline
transform = transforms.Compose([
    transforms.Resize((640, 640)),
    transforms.ToTensor()
])

# Function to predict and overlay tumor segmentation mask
def predict_tumor(image: Image.Image):
    try:
        image_tensor = transform(image).unsqueeze(0)  # Add batch dimension
        results = model.predict(image_tensor)
        output_image = results[0].plot()  # Overlay segmentation mask
        return Image.fromarray(output_image)
    except Exception as e:
        st.error(f"Prediction Error: {e}")
        return None

# Function to encode image to base64 for embedding
def get_base64_image(image_path):
    with open(image_path, "rb") as img_file:
        return base64.b64encode(img_file.read()).decode()

# Display logo
image_base64 = get_base64_image("logo/logo.png")
st.markdown(
    f'<div style="text-align: center;"><img src="data:image/png;base64,{image_base64}" width="100"></div>',
    unsafe_allow_html=True
)

# --- UI Customization ---
st.markdown("""
    <style>
        [data-testid="stSidebar"] { background-color: #1E1E2F; }
        [data-testid="stSidebar"] h1, [data-testid="stSidebar"] h2 { color: white; }
        h1 { text-align: center; font-size: 36px; font-weight: bold; color: #2C3E50; }
        div.stButton > button { background-color: #3498DB; color: white; font-weight: bold; }
        div.stButton > button:hover { background-color: #2980B9; }
    </style>
""", unsafe_allow_html=True)

# --- Sidebar ---
st.sidebar.header("📤 Upload an MRI Image")
uploaded_file = st.sidebar.file_uploader("Drag and drop or browse", type=['jpg', 'png', 'jpeg'])

# --- Main Page ---
st.title("Brain Tumor Segmentation")
st.markdown("<p style='text-align: center;'>Detect and segment brain tumors from MRI scans.</p>", unsafe_allow_html=True)

if uploaded_file:
    image = Image.open(uploaded_file).convert("RGB")
    col1, col2 = st.columns(2)
    
    with col1:
        st.image(image, caption="📷 Uploaded Image", use_container_width=True)
    
    if st.sidebar.button("🔍 Predict Tumor Segmentation"):
        segmented_image = predict_tumor(image)
        if segmented_image:
            with col2:
                st.image(segmented_image, caption="🎯 Segmented Tumor", use_container_width=True)
        else:
            st.error("Segmentation failed. Please try again.")

st.markdown("---")
st.info("This app uses **YOLO-Seg** for real-time tumor segmentation. Upload an MRI image to get started.")