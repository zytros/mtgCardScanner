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
    def __init__(self, baud, num_bins):
        self.baud = baud
        self.num_bins = num_bins
        
    def get_next_card(self):
        # blocking
        return -1
    
    def move_to_bin(self, bin):
        # blocking
        print("moved card to bin")
        return bin

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
        
class SortingCriteria:
    def __init__(self, sorting_criteria, num_bins):
        self.sorting_criteria = sorting_criteria
        if num_bins < 2:
            raise ValueError("not enough bins")
        self.num_bins = num_bins

        if self.sorting_criteria == "cmc":
            self._sort_fn = self._cmc_sort
        elif self.sorting_criteria == "color":
            self._sort_fn = self._color_sort
        else:
            self._sort_fn = self._cmc_sort

    def get_bin_for_card(self, card):
        return self._sort_fn(card)

    def _cmc_sort(self, card):
        bin = -1
        print("cmc_sort")
        return bin

    def _color_sort(self, card):
        bin = -1
        print("color_sort")
        return bin


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
        #self.card_data_list = []
        #self.card_nr = 0
        #self.last_entry = None
        #self.last_processed_frame = None
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
