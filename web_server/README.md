# MTG Card Scanner Web Application (`web_server`)

This folder contains the production-ready, full-stack web application for `mtgCardScanner`, mirroring all features and controls of the Streamlit interface with a modular Flask backend and a modern React + TypeScript frontend dashboard.

---

## Architecture

- **Backend (`backend/`):** A Flask REST API server utilizing OpenCV (`cv2`) for live video streaming, card detection/OCR, and sorting loop orchestration.
- **Frontend (`frontend/`):** A React & TypeScript single-page application providing real-time camera streaming, live status updates, sorting criteria management, set configuration, and card detection controls.

---

## Getting Started

### 1. Backend Setup & Running
Navigate to the backend directory, install requirements, and start the Flask server:
```bash
cd web_server/backend
pip install -r requirements.txt
python app.py
```
*(The backend server runs on `http://localhost:5050`)*

### 2. Frontend Setup & Running
Navigate to the frontend directory, install dependencies, and start the React development server:
```bash
cd web_server/frontend
npm install
npm start
```
*(The frontend dashboard runs on `http://localhost:3000` and connects to the backend API)*

---

## API Endpoints (`/api`)

- `GET /api/status`: Retrieves current sorting status, active set code, sorting criteria, and card count.
- `POST /api/config`: Updates set code, camera index, or sorting criteria (`cmc`, `color`, `price`).
- `POST /api/start`: Starts the automated sorting and scanning loop in a background thread.
- `POST /api/stop`: Stops the sorting loop.
- `POST /api/capture`: Triggers a single "Capture & Detect" action.
- `POST /api/next_card`: Fetches the next card via Arduino hardware integration.
- `POST /api/save`: Exports collected card inventory data to a CSV file.
- `GET /api/video_feed`: MJPEG live camera stream.
- `GET /api/latest_image`: Image of the most recently detected card.
