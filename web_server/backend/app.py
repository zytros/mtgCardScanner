import os
import sys
import threading
import time
import cv2
import numpy as np
from flask import Flask, jsonify, request, Response
from flask_cors import CORS

# Add parent directory to sys.path to import card_management, MTGCardDetection, sorting, etc.
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(os.path.dirname(current_dir))
sys.path.append(parent_dir)

from card_management import (
    Arduino,
    CardSorterRobot,
    CardSorterSoftware,
    CMCSort,
    ColorSort,
    PriceSort,
    WebCam,
)

app = Flask(__name__)
CORS(app)

# Global Sorter & State Management
class SorterManager:
    def __init__(self):
        self.camera_index = 0
        self.camera = WebCam(self.camera_index)
        self.arduino = Arduino(9600, 5)
        self.criteria = CMCSort(7)
        self.robot = CardSorterRobot(5, self.criteria, self.arduino, self.camera)
        self.css = CardSorterSoftware("data", "", self.robot, "neo")
        self.running = False
        self.last_img = None
        self.live_img = None
        self.last_entry = None
        self.lock = threading.Lock()
        self.thread = None

    def set_criteria(self, name):
        with self.lock:
            if name == "price":
                self.criteria = PriceSort(7)
            elif name == "color":
                self.criteria = ColorSort(7)
            else:
                self.criteria = CMCSort(7)
            self.robot.sorting_criteria = self.criteria

    def set_camera(self, index):
        with self.lock:
            self.camera_index = index
            self.camera = WebCam(index)
            self.robot.camera = self.camera

manager = SorterManager()

def background_sorting_loop():
    while manager.running:
        try:
            with manager.lock:
                img_new = manager.css.sort_loop()
                if img_new is not None and img_new.size > 0:
                    manager.last_img = img_new
                    if manager.css.card_data_list:
                        manager.last_entry = manager.css.card_data_list[-1]
            time.sleep(0.5)
        except Exception as e:
            print(f"Error in sorting loop: {e}")
            time.sleep(1)

@app.route("/api/status", methods=["GET"])
def get_status():
    with manager.lock:
        return jsonify({
            "running": manager.running,
            "set_code": manager.css.set_code,
            "criteria": type(manager.criteria).__name__.lower().replace("sort", ""),
            "camera_index": manager.camera_index,
            "card_count": len(manager.css.card_data_list),
            "last_entry": manager.last_entry
        })

@app.route("/api/config", methods=["POST"])
def update_config():
    data = request.json or {}
    if "set_code" in data:
        manager.css.reload_set_data(data["set_code"])
    if "criteria" in data:
        manager.set_criteria(data["criteria"])
    if "camera_index" in data:
        manager.set_camera(int(data["camera_index"]))
    return jsonify({"success": True})

@app.route("/api/start", methods=["POST"])
def start_sorting():
    with manager.lock:
        if not manager.running:
            manager.running = True
            manager.thread = threading.Thread(target=background_sorting_loop, daemon=True)
            manager.thread.start()
    return jsonify({"running": True})

@app.route("/api/stop", methods=["POST"])
def stop_sorting():
    with manager.lock:
        manager.running = False
    return jsonify({"running": False})

@app.route("/api/capture", methods=["POST"])
def capture_and_detect():
    with manager.lock:
        img_new, bin_nr = manager.css.capture_and_detect()
        if img_new is not None and img_new.size > 0:
            manager.last_img = img_new
        if manager.css.card_data_list:
            manager.last_entry = manager.css.card_data_list[-1]
    return jsonify({"success": True, "entry": manager.last_entry})

@app.route("/api/next_card", methods=["POST"])
def get_next_card():
    with manager.lock:
        manager.robot.arduino.get_next_card()
        manager.last_entry = None
    return jsonify({"success": True})

@app.route("/api/save", methods=["POST"])
def save_csv():
    with manager.lock:
        manager.css.write_data_to_disk()
    return jsonify({"success": True, "filename": manager.css.fn})

def gen_frames():
    while True:
        try:
            frame = manager.css.get_live_frame()
            if frame is None or frame.size == 0:
                # generate a blank placeholder frame if camera unavailable
                frame = np.zeros((480, 640, 3), dtype=np.uint8)
                cv2.putText(frame, "Waiting for camera...", (50, 240), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)
            
            success, buffer = cv2.imencode('.jpg', frame)
            if success:
                yield (b'--frame\r\n'
                       b'Content-Type: image/jpeg\r\n\r\n' + buffer.tobytes() + b'\r\n')
        except Exception:
            pass
        time.sleep(0.1)

@app.route("/api/video_feed")
def video_feed():
    return Response(gen_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route("/api/latest_image")
def latest_image():
    with manager.lock:
        img = manager.last_img
        if img is None or img.size == 0:
            img = np.zeros((480, 640, 3), dtype=np.uint8)
            cv2.putText(img, "No detected card", (50, 240), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)
        success, buffer = cv2.imencode('.jpg', img)
        if success:
            return Response(buffer.tobytes(), mimetype='image/jpeg')
    return Response(status=404)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5050, debug=False)
