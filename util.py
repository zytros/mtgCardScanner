import requests
import cv2
import numpy as np
from MTGCardDetection import getCardName, get_cards_in_set

cards = []
prices = []

card_lists_fns = []
for i in range(15):
    card_lists_fns.append(f'card_list_{i}.txt')

def get_picture(save_path=None, side=0):
    url = "http://192.168.178.51/capture"  # Replace <ESP32_CAM_IP> with the actual IP address of your ESP32-CAM
    response = requests.get(url)
    
    if response.status_code == 200:
        if save_path:
            with open(save_path, "wb") as file:
                file.write(response.content)
            print(f"Image saved as {save_path}")
        else:
            image_array = np.frombuffer(response.content, dtype=np.uint8)
            # Decode the image array to an OpenCV image
            image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)
            #img_cropped = image[480:1150, 220:1400] #TODO: correct values, include side
            img_cropped = image
            return img_cropped
    else:
        print("Failed to capture image")
        return np.zeros((600,400,3), np.uint8)

def get_card_details(cardname):
    """
    Given a card name, look up the card's details on Scryfall.

    Args:
        cardname (str): The name of the card to look up.

    Returns:
        dict: A dictionary containing the card's details, or None if the card is not found.
    """
    url = f"https://api.scryfall.com/cards/named?exact={cardname}"
    response = requests.get(url)
    
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Error: {response.status_code} - {response.reason}")
        return None
    
def get_cmc(cardname):
    details = get_card_details(cardname)
    if details:
        return details["cmc"]
    else:
        return None
    
def get_colors(cardname):
    details = get_card_details(cardname)
    if details:
        return details["colors"]
    else:
        return None

def get_color_identity(cardname):
    details = get_card_details(cardname)
    if details:
        return details["color_identity"]
    else:
        return None
    
def get_type(cardname):
    details = get_card_details(cardname)
    if details:
        type_line = details["type_line"]
        if 'Artifact Creature' in type_line:
            return 'Artifact Creature'
        if 'Enchantment Creature' in type_line:
            return 'Enchantment Creature'
        if 'Artifact' in type_line:
            return 'Artifact'
        if 'Battle' in type_line:
            return 'Battle'
        if 'Creature' in type_line:
            return 'Creature'
        if 'Enchantment' in type_line:
            return 'Enchantment'
        if 'Instant' in type_line:
            return 'Instant'
        if 'Land' in type_line:
            return 'Land'
        if 'Planeswalker' in type_line:
            return 'Planeswalker'
        if 'Sorcery' in type_line:
            return 'Sorcery'
    else:
        return None
    
def is_in_list(cardname, cardlist):
    """
    Check if a card is in a list of cards.

    Args:
        cardname (str): The name of the card to check.
        cardlist (list): A list of card names.

    Returns:
        bool: True if the card is in the list, False otherwise.
    """
    return cardname in cardlist

def is_in_colors(cardname, colors):
    """
    Check if a card is in a list of colors.

    Args:
        cardname (str): The name of the card to check.
        colors (list): A list of colors.

    Returns:
        bool: True if the card is in the list, False otherwise.
    """
    card_colors = get_colors(cardname)
    return all(color in card_colors for color in colors)

def is_in_color_identity(cardname, colors):
    """
    Check if a card is in a list of color identities.

    Args:
        cardname (str): The name of the card to check.
        colors (list): A list of colors.

    Returns:
        bool: True if the card is in the list, False otherwise.
    """
    card_color_identity = get_color_identity(cardname)
    return all(color in card_color_identity for color in colors)

def is_in_type(cardname, cardtype):
    """
    Check if a card is of a certain type.

    Args:
        cardname (str): The name of the card to check.
        cardtype (str): The type of the card.

    Returns:
        bool: True if the card is of the specified type, False otherwise.
    """
    return get_type(cardname) == cardtype

def is_cmc(cardname, cmc):
    """
    Check if a card has a certain converted mana cost.

    Args:
        cardname (str): The name of the card to check.
        cmc (int): The converted mana cost to check.

    Returns:
        bool: True if the card has the specified converted mana cost, False otherwise.
    """
    return get_cmc(cardname) == cmc

def get_bin_nr_cmc(cardname):
    cmc = get_cmc(cardname)
    if cmc is not None:
        return min(cmc+1, 15)
    else:
        return 15
    
def get_bin_nr_color(cardname):
    colors = get_colors(cardname)
    if colors is not None:
        if len(colors) == 0:
            # Colorless
            return 6
        elif len(colors) == 1:
            # Monocolor
            return ['W','U','B','R','G'].index(colors[0]) + 1
        else:
            # Multicolor
            if len(colors) == 2:
                return 7
            elif len(colors) == 3:
                return 8
            elif len(colors) == 4:
                return 9
            elif len(colors) == 5:
                return 10
    else:
        return 15
    
def get_bin_nr_type(cardname):
    cardtype = get_type(cardname)
    if cardtype is not None:
        if cardtype == 'Creature':
            return 1
        elif cardtype == 'Artifact':
            return 2
        elif cardtype == 'Enchantment':
            return 3
        elif cardtype == 'Instant':
            return 4
        elif cardtype == 'Sorcery':
            return 5
        elif cardtype == 'Land':
            return 6
        elif cardtype == 'Planeswalker':
            return 7
        elif cardtype == 'Artifact Creature':
            return 8
        elif cardtype == 'Enchantment Creature':
            return 9
    else:
        return 11
    
def get_bin_nr_list(cardname):
    for i in range(14):
        try:
            with open(card_lists_fns[i], 'r') as file:
                lines = file.read().splitlines()
        except:
            lines = []
        if is_in_list(cardname, lines):
            return i+1
    return 15

def get_db_add_card_command(cardname, set_code):
    return f"INSERT INTO cards (name, set_name) VALUES ('{cardname}', '{set_code}');"

def add_card_to_db(cardname, set_code, db_cursor):
    if not (cardname == 'Not Found in Chosen Set' or cardname == ''):
        db_cursor.execute(get_db_add_card_command(cardname, set_code))
    else:
        print('Card not added to database')
        
def crop_image(image, dims):
    """
    Crops an image to the specified rectangle.

    Parameters:
    - image: image to crop
    - x: int, x-coordinate of the top-left corner of the cropping rectangle.
    - y: int, y-coordinate of the top-left corner of the cropping rectangle.
    - width: int, width of the cropping rectangle.
    - height: int, height of the cropping rectangle.

    Returns:
    - cropped_image: numpy.ndarray, the cropped image.
    """
    x,y,width,height = dims
    cropped_image = image[y:y+height, x:x+width]

    return cropped_image