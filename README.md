# MTG Card Scanner & Sorter (`mtgCardScanner`)

`mtgCardScanner` is a complete hardware-software system designed to automate Magic: The Gathering (MTG) card scanning, identification, pricing, sorting, and collection management.

---

## Features

- **Automated Card Detection & OCR:** Uses OpenCV, Tesseract OCR, and Scryfall API integration to identify card names, sets, pricing, and metadata from camera feeds.
- **Physical Sorting Robot:** Integrates with Arduino via serial communication (`pyserial`) to physically sort cards into bins based on configurable criteria.
- **Multiple Sorting Algorithms:** Sort by Converted Mana Cost (CMC), color, price, type, etc.
- **Multiple User Interfaces:**
  - **Full-Stack Web App:** Flask backend & React/TypeScript frontend dashboard (`web_server/`).
  - **Streamlit UI:** Modern web dashboard (`streamlit_ui.py`).
  - **Tkinter Desktop App:** Traditional desktop control panel (`app.py`).
- **Database Tracking:** Local SQLite database (`cards.db`) for storing scanned card records and inventory.

---

## Project Structure

- `streamlit_ui.py` - Primary Streamlit user interface.
- `app.py` - Tkinter-based desktop interface.
- `MTGCardDetection.py` - Core card detection, OCR, and Scryfall API querying logic.
- `card_management.py` - Main business logic for card scanning loops and database tracking.
- `sorting/` - Sorting logic modules (`cmc_sort.py`, `color_sort.py`, `price_sort.py`, etc.).
- `HWcomunication.py` - Serial communication interface with Arduino hardware.
- `sketch_aug7a/` - Arduino firmware (`sketch_aug7a.ino`).
- `web_server/` - Full-stack web application (`backend/` Flask API & `frontend/` React/TypeScript SPA) and Kubernetes Helm charts.
- `tests/` - Unit tests.

---

## Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/mtgCardScanner.git
   cd mtgCardScanner
   ```

2. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Install Tesseract OCR:**
   Ensure Tesseract OCR is installed on your system and configured properly (e.g., `/usr/bin/tesseract` or Windows equivalent).

---

## Running the Application

### 1. Full-Stack Web App (`web_server`)
- **Backend (Flask):**
  ```bash
  cd web_server/backend
  pip install -r requirements.txt
  python app.py
  ```
- **Frontend (React):**
  ```bash
  cd web_server/frontend
  npm install
  npm start
  ```

### 2. Streamlit Dashboard
```bash
streamlit run streamlit_ui.py
```

### 3. Tkinter Desktop App
```bash
python app.py
```

---

## Testing

Run Python tests with pytest:
```bash
pytest
```
