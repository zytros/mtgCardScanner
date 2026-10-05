# MTG Card Scanner & Sorter

## Project Overview
`mtgCardScanner` is a comprehensive Magic: The Gathering (MTG) card scanning, identification, sorting, and management system. It combines computer vision (OpenCV, Tesseract OCR), Scryfall API integration, database tracking (SQLite), Arduino-based physical hardware sorting mechanisms, and web/desktop interfaces (Streamlit, Tkinter, Flask + React).

### Key Components
- **Core Card Detection & API:** `MTGCardDetection.py`, `card_management.py`, `util.py` handle image processing, OCR, card matching against Scryfall API data, and database logging (`cards.db`).
- **Sorting Modules:** `sorting/` package (`cmc_sort.py`, `color_sort.py`, `price_sort.py`, `sorting.py`) provides criteria for sorting cards by converted mana cost, color, price, etc.
- **Hardware Integration:** `HWcomunication.py` and Arduino firmware (`sketch_aug7a/sketch_aug7a.ino`) interface with sorter hardware via serial connection (`pyserial`).
- **User Interfaces:**
  - **Streamlit UI:** `streamlit_ui.py` (primary modern interface for scanning, sorting, and management).
  - **Tkinter App:** `app.py` (desktop control interface).
- **Web Server & Dashboard:** `web_server/` contains a Flask backend (`backend-project/`) and a React/TypeScript frontend (`react-frontend/`), along with Helm charts (`helm/`) for Kubernetes deployment.

---

## Building and Running

### Python Environment & Dependencies
1. Install main dependencies (OpenCV, requests, pandas, streamlit, pyserial, pillow, easygui, etc.):
   ```bash
   pip install -r requirements.txt  # or install individual packages as needed
   ```
2. **Run Streamlit UI:**
   ```bash
   streamlit run streamlit_ui.py
   ```
3. **Run Tkinter Desktop App:**
   ```bash
   python app.py
   ```

### Web Server (Backend & Frontend)
1. **Backend (Flask):**
   ```bash
   cd web_server/backend-project
   pip install -e .
   start-mtg-server
   ```
2. **Frontend (React):**
   ```bash
   cd web_server/react-frontend
   npm install
   npm start
   ```

### Testing
- Run Python tests:
  ```bash
  pytest
  # or python -m unittest discover tests
  ```
- Run Frontend tests:
  ```bash
  cd web_server/react-frontend
  npm test
  ```

---

## Development Conventions
- **Python:** Adhere to PEP 8 style guidelines. Use type hints where appropriate.
- **TypeScript / React:** Strict type checking (`tsconfig.json`), functional components, and modular React hooks/components under `web_server/react-frontend/src/`.
- **Hardware Firmware:** Arduino C/C++ sketches in `sketch_aug7a/`.
- **Testing:** Add unit tests in `tests/` for new sorting logic or card management utilities.
