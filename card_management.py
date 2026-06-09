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
            self.sort = self._cmc_sort
        elif self.sorting_criteria == "color":
            self.sort = self._color_sort
        
        
    def sort(self, card):
        raise NotImplementedError
    
    def _cmc_sort(self, card):
        bin = -1
        print("cmc_sort")
        return bin
    
    def _color_sort(self, card):
        bin = -1
        print("color_sort")
        return bin
    
class CardSorterSoftware:
    def __init__(self, data_folder, img_folder, robot, set_code = None):
        self.data_folder : str = data_folder
        self.img_folder : str = img_folder
        self.robot : CardSorterRobot = robot
        if set_code:
            self.set_code = set_code
        else:
            set_names, set_codes = list_all_mtg_sets()
            setChoice = choicebox("Selected any set from the list given below", "Magic the Gathering Sets", set_names)
            idx = set_names.index(setChoice)
            self.set_code = set_codes[idx]
        self.card_names, self.card_prices = get_cards_in_set(self.set_code)
        timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
        self.fn = f"{data_folder}/cards_{timestamp}_{self.set_code}.csv"
        self.card_data_list = []
        self.card_nr = 0
        
    def sort_loop(self):
        self.robot.arduino.get_next_card()
        img = self.robot.camera.get_picture()
        name, img_new, price = getCardName(img, self.card_names, self.card_prices)
        if name == "Not Found in Chosen Set" or name == "":
            bin_nr = 0
        else:
            bin_nr = self.robot.sorting_criteria.sort(name)
        entry = {'card_name': name, 'card_price': price, 'bin': bin_nr, 'card_nr': self.card_nr}
        self.card_nr += 1
        self.card_data_list.append(entry)
        self.robot.arduino.move_to_bin(bin_nr)
        return entry, img_new
        
        
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
