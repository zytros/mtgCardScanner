import requests
import os
import pytesseract
from PIL import Image
from difflib import SequenceMatcher
import cv2


def extract_text_from_image(img):
    text = pytesseract.image_to_string(img, lang='eng')
    return text

def crop_image(img, top_left, bottom_right):
    """
    Crops an image based on the provided top-left and bottom-right coordinates.
    
    Parameters:
    - image_path: Path to the image file.
    - top_left: A tuple (x, y) representing the top left corner of the crop rectangle.
    - bottom_right: A tuple (x, y) representing the bottom right corner of the crop rectangle.
    
    Returns:
    A PIL Image object representing the cropped image.
    """
    # Calculate the crop rectangle
    crop_rectangle = (top_left[0], top_left[1], bottom_right[0], bottom_right[1])
    
    # Crop the image
    cropped_img = img.crop(crop_rectangle)
    
    return cropped_img

def find_highest_probability_match(predicted_cardname, card_names):
    """
    Finds the card name with the highest similarity to the predicted card name.
    
    Parameters:
    - predicted_cardname: The predicted name of the card.
    - card_names: A list of all possible card names.
    
    Returns:
    The card name from the list that has the highest similarity to the predicted name.
    """
    highest_ratio = 0
    best_match = None
    for name in card_names:
        ratio = SequenceMatcher(None, predicted_cardname, name).ratio()
        if ratio > highest_ratio:
            highest_ratio = ratio
            best_match = name
            
    return best_match

def predict_card(img, cardnames):
    img_crop = crop_image(img, (0,0), (175, 30))
    extracted_text = extract_text_from_image(img_crop).replace('\n', ' ')
    return find_highest_probability_match(extracted_text, cardnames)

def get_multiverse_ids(set_code):
    url = f"https://api.scryfall.com/cards/search?order=set&q=e:{set_code}&unique=prints"
    response = requests.get(url)
    
    if response.status_code != 200:
        raise Exception(f"Error fetching data from Scryfall: {response.status_code}")
    
    data = response.json()
    multiverse_ids = []
    
    while True:
        for card in data['data']:
            if 'multiverse_ids' in card:
                multiverse_ids.extend(card['multiverse_ids'])
        
        if data['has_more']:
            next_page = data['next_page']
            response = requests.get(next_page)
            if response.status_code != 200:
                raise Exception(f"Error fetching next page from Scryfall: {response.status_code}")
            data = response.json()
        else:
            break
    
    return multiverse_ids

def get_card_name_by_multiverse_id(multiverse_id):
    """
    Fetches the name of a Magic: The Gathering card using its Multiverse ID.
    
    Parameters:
    - multiverse_id: The Multiverse ID of the card.
    
    Returns:
    The name of the card if found, otherwise an error message.
    """
    url = f"https://api.scryfall.com/cards/multiverse/{multiverse_id}"
    response = requests.get(url)
    
    if response.status_code == 200:
        data = response.json()
        return data['name']
    else:
        return f"Error: Could not fetch card with Multiverse ID {multiverse_id}. Status code: {response.status_code}"

def read_cardnames_from_file(filename):
    with open(filename, 'r') as file:
        cardnames = file.read().splitlines()
    return cardnames

def download_cardnames(expansion):
    multiverse_ids = get_multiverse_ids(expansion)
    cardnames = [get_card_name_by_multiverse_id(multiverse_id) for multiverse_id in multiverse_ids]
    with open(f'{expansion}.txt', 'w') as file:
        for cardname in cardnames:
            file.write(f"{cardname}\n")