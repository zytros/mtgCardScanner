'''
Loop:
- get one card
- scan card
- bin card
- physically sort card, add to db
'''

import numpy as np
import cv2
from easygui import *
from MTGCardDetection import list_all_mtg_sets, get_cards_in_set, getCardName
from datetime import datetime
import pandas as pd
import os
import glob
import time

try:
    import serial
except ImportError:  # pragma: no cover - import is environment-dependent
    serial = None


class Camera:
    def __init__(self, address):
        self.address = address
        
    def get_picture(self) -> np.array:
        return np.array([[]])
    
class WebCam(Camera):
    def __init__(self, address):
        super().__init__(address)
        self.cap = cv2.VideoCapture(self.address)
        
    def __del__(self):
        self.cap.release()
        
    def get_picture(self) -> np.array:
        suc, img = self.cap.read()
        return img
        

class Arduino:
    def __init__(self, baud, num_bins, port=None):
        self.baud = baud
        self.num_bins = num_bins
        self.port = port or self._detect_port()
        self._serial = None
        self._connect()

    def _detect_port(self):
        candidates = []
        for pattern in ("/dev/ttyACM*", "/dev/ttyUSB*", "/dev/tty.usbmodem*", "/dev/tty.usbserial*"):
            candidates.extend(glob.glob(pattern))
        candidates.extend(["COM3", "COM4", "COM5"])
        return candidates[0] if candidates else None

    def _connect(self):
        if serial is None:
            raise ImportError("pyserial is required to talk to the Arduino. Install it with 'pip install pyserial'.")

        if self.port is None:
            raise ConnectionError("No Arduino serial port detected. Connect the board and set the port explicitly.")

        self._serial = serial.Serial(self.port, self.baud, timeout=1)
        self._serial.reset_input_buffer()
        self._serial.reset_output_buffer()
        print(f"Connected to Arduino on port {self.port} on baud {self.baud}")

    def _send_command(self, command, expected_reply, timeout=15.0):
        if self._serial is None or not self._serial.is_open:
            self._connect()

        print(f"sending command {command}")
        self._serial.reset_input_buffer()
        self._serial.write((command + "\n").encode("utf-8"))
        self._serial.flush()

        deadline = time.time() + timeout
        while time.time() < deadline:
            if self._serial.in_waiting > 0:
                line = self._serial.readline().decode("utf-8", errors="ignore").strip()
                if line:
                    if expected_reply is None or line == expected_reply:
                        return line
            time.sleep(0.01)

        raise TimeoutError(f"Timed out waiting for reply '{expected_reply}' from Arduino")

    def get_next_card(self):
        try:
            self._send_command("get_card", "GET_CARD_DONE", timeout=15.0)
            return 0
        except Exception as exc:
            print(f"could not trigger card acquisition: {exc}")
            return -1

    def move_to_bin(self, bin):
        try:
            self._send_command(f"move_bin {bin}", "MOVE_BIN_DONE", timeout=5.0)
            return bin
        except Exception as exc:
            print(f"could not move card to bin: {exc}")
            return -1

    def __del__(self):
        if getattr(self, "_serial", None) is not None and self._serial.is_open:
            self._serial.close()

class CardSorterRobot:
    def __init__(self, num_bins, sorting_criteria, arduino, camera):
        self.num_bins = num_bins
        self.sorting_criteria : SortingCriteria = sorting_criteria
        self.arduino : Arduino = arduino
        self.camera : Camera = camera
        self.current_img = np.array([[]])

    def get_next_card(self):
        succ = self.arduino.get_next_card()
        if succ == -1:
            print("next card not fetched")
            
    def get_image(self):
        img = self.camera.get_picture()
        if img.shape == [0,0]:
            print("got empty image")
        self.current_img = img
            
    def move_card_to_bin(self, bin):
        succ = self.arduino.move_to_bin(bin)
        if succ == -1:
            print("couldn't move card to bin")
        
class CardSorterSoftware:
    def __init__(self, data_folder, img_folder, robot, set_code=None):
        self.data_folder: str = data_folder
        self.img_folder: str = img_folder
        self.robot: CardSorterRobot = robot
        if set_code:
            self.set_code = set_code
        else:
            set_names, set_codes = list_all_mtg_sets()
            setChoice = choicebox("Selected any set from the list given below", "Magic the Gathering Sets", set_names)
            idx = set_names.index(setChoice)
            self.set_code = set_codes[idx]
        self.fn = "-1"
        self._load_cards_for_set(self.set_code)
        self.card_data_list = []
        self.card_nr = 0
        self.last_entry = None
        self.last_processed_frame = None
        

    def _load_cards_for_set(self, set_code):
        self.card_names, self.card_prices = get_cards_in_set(set_code)
        if self.fn == "-1":
            timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
            self.fn = f"{self.data_folder}/cards_{timestamp}_{set_code}.csv"

    def reload_set_data(self, set_code):
        self.set_code = set_code
        self._load_cards_for_set(self.set_code)
        print(f"changed set code to {set_code} with a total of {len(self.card_names)} cards.")

    def get_live_frame(self):
        if self.robot is None or self.robot.camera is None:
            return None
        frame = self.robot.camera.get_picture()
        return frame

    def capture_and_detect(self, image=None):
        if image is None:
            image = self.get_live_frame()

        if image is None:
            return None, None

        name, img_new, price = getCardName(image, self.card_names, self.card_prices)
        if name == "Not Found in Chosen Set" or name == "":
            bin_nr = 0
        else:
            bin_nr = self.robot.sorting_criteria.get_bin_for_card(name)

        entry = {'card_name': name, 'card_price': price, 'bin': bin_nr, 'card_nr': self.card_nr}
        self.card_nr += 1
        self.card_data_list.append(entry)
        #self.robot.arduino.move_to_bin(bin_nr)
        self.last_processed_frame = img_new if img_new is not None else image
        return self.last_processed_frame, bin_nr

    def sort_loop(self):
        self.robot.arduino.get_next_card()
        last_frame, bin_nr = self.capture_and_detect()
        self.robot.arduino.move_to_bin(bin_nr)
        return last_frame

    def write_data_to_disk(self):
        if not os.path.exists(self.fn):
            df = pd.DataFrame(self.card_data_list)
            df.to_csv(self.fn, index=False)
            print(f"Wrote Data to csv.")
        else:
            print(f"File {self.fn} already exists.")
        
        
        
        
if __name__ == "__main__":
    camera = WebCam(0)
    arduino = Arduino(11500, 5)
    criteria = SortingCriteria("cmc", 5)
    card_sorting_robot = CardSorterRobot(5, criteria, arduino, camera)
    css = CardSorterSoftware("data", "", card_sorting_robot, "sos")
    css.sort_loop()
    css.write_data_to_disk()
