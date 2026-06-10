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


def init_sorter(set_code="khm"):
    camera = WebCam(0)
    arduino = Arduino(9600, 5)
    criteria = SortingCriteria("cmc", 5)
    robot = CardSorterRobot(5, criteria, arduino, camera)
    return CardSorterSoftware("data", "", robot, set_code)


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
    st.session_state.running = False
if "css" not in st.session_state:
    st.session_state.css = init_sorter()
if "last_entry" not in st.session_state:
    st.session_state.last_entry = None
if "last_img" not in st.session_state:
    st.session_state.last_img = None
if "live_img" not in st.session_state:
    st.session_state.live_img = None

st.sidebar.title("Menu")
current_set_code = st.session_state.css.set_code if st.session_state.css is not None else "khm"
set_code = st.sidebar.text_input("Set Code", value=current_set_code)
if st.sidebar.button("Apply Set Code"):
    st.session_state.css.reload_set_data(set_code)
    st.session_state.last_entry = None
    st.session_state.last_img = None
    st.session_state.live_img = None

st.sidebar.subheader("Future Controls")
st.sidebar.write("- Sorting mode")
st.sidebar.write("- Bin routing")
st.sidebar.write("- DB filters")

start_col, status_col, stop_col, capture_col, save_col, fetch_col = st.columns(6)
if start_col.button("Start"):
    st.session_state.running = True
if stop_col.button("Stop"):
    st.session_state.running = False
if capture_col.button("Capture & Detect"):
    img_new, _ = st.session_state.css.capture_and_detect()
    st.session_state.last_img = img_new
if save_col.button("Save CSV"):
    st.session_state.css.write_data_to_disk()
if fetch_col.button("Get Next Card"):
    st.session_state.css.robot.arduino.get_next_card()
    st.session_state.last_entry = None

status_color = "#28a745" if st.session_state.running else "#dc3545"
status_text = "running" if st.session_state.running else "stopped"
status_col.markdown(
    f"<div style='color:{status_color}; font-weight:bold; text-align:center; padding-top:0.45rem;'>{status_text}</div>",
    unsafe_allow_html=True,
)

live_frame = st.session_state.css.get_live_frame() if st.session_state.css is not None else None
if live_frame is not None:
    st.session_state.live_img = live_frame

left_col, right_col = st.columns(2)
with left_col:
    st.subheader("Live Camera")
    if st.session_state.live_img is not None:
        st.image(to_rgb(st.session_state.live_img), caption="Live Camera")
    else:
        st.info("Waiting for camera feed...")

with right_col:
    st.subheader("Latest Detected Card")
    if st.session_state.last_img is not None:
        st.image(to_rgb(st.session_state.last_img), caption="Last Detected Card")
    else:
        st.info("No detected card yet")

if st.session_state.running:
    img_new = st.session_state.css.sort_loop()
    st.session_state.last_img = img_new

if True:
    time.sleep(0.03)
    st.rerun()
