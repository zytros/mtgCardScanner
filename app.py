import tkinter as tk
from tkinter import ttk
from PIL import Image, ImageTk
from util import get_bin_nr_cmc, get_bin_nr_color, get_bin_nr_type, get_bin_nr_list, get_picture, get_db_add_card_command, crop_image
from MTGCardDetection import getCardName, get_cards_in_set
from HWcomunication import set_bin, swipe, move_sledge, open_serial, close_serial, set_led
import sqlite3
import time
import threading

db = sqlite3.connect('cards.db')
db_cursor = db.cursor()

ser = open_serial()

cards = []
prices = []

sort_function = get_bin_nr_cmc
sort_function_name = 'cmc'

set_code = 'stx'
running = False
def loop_iteration():
    # perform for left, right
    # get image
    image = get_picture()
    image1 = crop_image(image, 0, 0, 800, 600)
    image2 = crop_image(image, 800, 0, 800, 600)
    # get card name
    name, image_new = getCardName(image1, card_names=cards, card_prices=prices)
    # TODO: set card image
    # get bin number
    bin_nr = sort_function(name)
    # set bin number
    set_bin(bin_nr)
    # swipe
    swipe(0)
    # add to db
    db_cursor.execute(get_db_add_card_command(name, set_code))
    # get card name
    name, image_new = getCardName(image2, card_names=cards, card_prices=prices)
    # TODO: set card image
    # get bin number
    bin_nr = sort_function(name)
    # set bin number
    set_bin(bin_nr)
    # swipe
    swipe(1)
    # add to db
    db_cursor.execute(get_db_add_card_command(name, set_code))
    # adjust card height
    move_sledge(1)
    
    pass

def start():
    global running
    running = True
    while running:
        loop_iteration()
        time.sleep(0.1)

def stop():
    global running
    running = False

def open_new_window():
    
    def nothing():
        pass
    
    def set_sort_function(fn, fn_name):
        global sort_function
        sort_function = fn
        global sort_function_name
        sort_function_name = fn_name
        sort_function_name_var.set("Select sorting method, current: " + sort_function_name)
        print(f"Sort function set to {fn_name}")
        
    new_window = tk.Toplevel(root)
    new_window.title("New Window")

    # Create a frame for the top buttons
    top_frame = tk.Frame(new_window)
    top_frame.pack(pady=10)

    sort_function_name_var = tk.StringVar(value=sort_function_name)

    label = tk.Label(top_frame, textvariable=sort_function_name_var)
    label.pack(side=tk.TOP, pady=5)


    cmc_button = tk.Button(top_frame, text="CMC", command=lambda: set_sort_function(get_bin_nr_cmc, 'cmc'))
    cmc_button.pack(side=tk.LEFT, padx=5)
    color_button = tk.Button(top_frame, text="Color", command=lambda: set_sort_function(get_bin_nr_color, 'color'))
    color_button.pack(side=tk.LEFT, padx=5)
    type_button = tk.Button(top_frame, text="Type", command=lambda: set_sort_function(get_bin_nr_type, 'type'))
    type_button.pack(side=tk.LEFT, padx=5)
    list_button = tk.Button(top_frame, text="List", command=lambda: set_sort_function(get_bin_nr_list, 'list'))
    list_button.pack(side=tk.LEFT, padx=5)

    

root = tk.Tk()
root.title("Image Viewer")


frame = tk.Frame(root)
frame.pack(pady=10)

text_box = tk.Entry(frame)
text_box.insert(0, "Set Code")  
text_box.pack(side=tk.LEFT, padx=5)


cmd_start = tk.Button(frame, text="Start", command=lambda: threading.Thread(target=start).start())
cmd_start.pack(side=tk.LEFT, padx=5)

cmd_stop = tk.Button(frame, text="Stop", command=lambda: stop())
cmd_stop.pack(side=tk.LEFT, padx=5)

cmd_card_loader_down = tk.Button(frame, text="Card Loader Down", command=lambda: move_sledge(-1000))
cmd_card_loader_down.pack(side=tk.LEFT, padx=5)

cmd_card_loader_up = tk.Button(frame, text="Card Loader Up", command=lambda: move_sledge(1000))
cmd_card_loader_up.pack(side=tk.LEFT, padx=5)

# Create a button to open a new window
new_window_button = tk.Button(frame, text="Select Sorting", command=open_new_window)
new_window_button.pack(side=tk.LEFT, padx=5)

# Create a label to display the image
image_label = tk.Label(root)
image_label.pack(pady=10)

img = Image.open("capture.png")
img = img.resize((800, 600), Image.LANCZOS)
img_tk = ImageTk.PhotoImage(img)
image_label.config(image=img_tk)
image_label.image = img_tk

# Run the application
root.mainloop()

close_serial(ser)
db.commit()