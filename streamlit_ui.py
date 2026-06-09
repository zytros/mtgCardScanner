import time

import cv2
import streamlit as st

from card_management import (
    Arduino,
    CardSorterRobot,
    CardSorterSoftware,
    SortingCriteria,
    WebCam,
)


def to_rgb(image):
    if image is None:
        return None
    return cv2.cvtColor(image, cv2.COLOR_BGR2RGB)


def init_sorter():
    camera = WebCam(0)
    arduino = Arduino(11500, 5)
    criteria = SortingCriteria("cmc", 5)
    robot = CardSorterRobot(5, criteria, arduino, camera)
    return CardSorterSoftware("data", "", robot)


st.set_page_config(page_title="MTG Card Scanner", layout="wide")

st.markdown(
        """
        <style>
            html, body {
                overflow: hidden;
            }

            [data-testid="stAppViewContainer"],
            [data-testid="stMain"],
            .block-container {
                height: 100vh;
                overflow: hidden;
                padding-top: 0.75rem;
                padding-bottom: 0.5rem;
            }

            [data-testid="stSidebar"] {
                overflow-y: auto;
            }

            [data-testid="stImage"] img {
                display: block;
                width: auto !important;
                height: auto !important;
                max-width: 100% !important;
                max-height: calc(100vh - 210px) !important;
                object-fit: contain;
                margin: 0 auto;
            }
        </style>
        """,
        unsafe_allow_html=True,
)

st.title("MTG Card Scanner")

if "running" not in st.session_state:
    st.session_state.running = True
if "css" not in st.session_state:
    st.session_state.css = init_sorter()
if "last_entry" not in st.session_state:
    st.session_state.last_entry = None
if "last_img" not in st.session_state:
    st.session_state.last_img = None

# Right-side menu bar for future controls.
st.sidebar.title("Menu")
set_code = st.sidebar.text_input("Set Code", value="sos")
if st.sidebar.button("Apply Set Code"):
    st.session_state.css = init_sorter(set_code)
    st.session_state.last_entry = None
    st.session_state.last_img = None

st.sidebar.subheader("Future Controls")
st.sidebar.write("- Sorting mode")
st.sidebar.write("- Bin routing")
st.sidebar.write("- DB filters")

start_col, stop_col, save_col = st.columns(3)
if start_col.button("Start"):
    st.session_state.running = True
if stop_col.button("Stop"):
    st.session_state.running = False
if save_col.button("Save CSV"):
    st.session_state.css.write_data_to_disk()

q_key = st.text_input("Press q + Enter to stop/close scanner", value="")
if q_key.lower().strip() == "q":
    st.session_state.running = False

if st.session_state.running:
    entry, img_new = st.session_state.css.sort_loop()
    st.session_state.last_entry = entry
    st.session_state.last_img = img_new

if st.session_state.last_img is not None:
    st.image(to_rgb(st.session_state.last_img), caption="Detected Card (img_new)")
else:
    st.info("Waiting for first scanned card image...")

if st.session_state.last_entry is not None:
    st.write("Latest scan:")
    st.json(st.session_state.last_entry)

if st.session_state.running:
    time.sleep(0.2)
    st.rerun()
