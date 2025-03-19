# Brain Tumor Segmentation

## Overview
Brain Tumor Segmentation is a deep learning application that leverages YOLO-Seg to detect and segment brain tumors from MRI scans in real-time.

## Model Details
- **Architecture:** YOLO-Seg based model
- **Model File:** `model/best.pt`
- **Libraries:** Streamlit, Ultralytics YOLO, PyTorch, torchvision, Pillow

## Installation
- Clone the repository.
- Install dependencies:
  ```bash
  pip install -r requirements.txt
  ```
- Ensure the model file is available at `model/best.pt`.

## Usage
- Run the application using:
  ```bash
  streamlit run app.py
  ```
- Upload an MRI image via the sidebar.
- Click "🔍 Predict Tumor Segmentation" to view the segmented output.

## Customization
- UI customization is implemented in `app.py` using Streamlit's markdown styling.
- The model is cached to optimize performance.

## License
Specify your license details here.
