
import cv2
import pytesseract
import difflib
from bs4 import BeautifulSoup as soup
from urllib.request import urlopen as uReq
import numpy as np
from easygui import *
import re
import collections
import requests

# gets passed an error for no Sequence in collections
collections.Mapping = collections.abc.Mapping
collections.Sequence = collections.abc.Sequence

# directory of py tesseract, installed in accordance with the readme
# for windows you can use the following format as an example
pytesseract.pytesseract.tesseract_cmd = 'C:/Program Files/Tesseract-OCR/tesseract.exe'


def list_all_mtg_sets(no_children=False):
    """
    Lists all the Magic the Gathering sets available on Scryfall.

    :param no_children: If True, only the parent sets are returned.
    :return: A tuple containing two lists:
        - set_names: List of set names.
        - set_codes: List of set codes.
    """
    url = "https://api.scryfall.com/sets"
    response = requests.get(url)
    set_names = []
    set_codes = []
    if response.status_code == 200:
        sets_data = response.json()
        if no_children:
            for set_info in sets_data['data']:
                if 'parent_set_code' not in set_info:
                    set_names.append(set_info['name'])
                    set_codes.append(set_info['code'])
        else:
            set_names = [set_info['name'] for set_info in sets_data['data']]
            set_codes = [set_info['code'] for set_info in sets_data['data']]
        return set_names, set_codes
    else:
        print("Failed to fetch sets from Scryfall")
        return []
    
def get_cards_in_set(set_code):
    """
    Fetches all the cards in a given set from Scryfall.

    :param set_code: The Magic the Gathering set code.
    :return: A tuple containing two lists:
        - card_name: List of card names.
        - card_price: List of card prices in USD.
    """
    url = f"https://api.scryfall.com/cards/search?order=set&q=e%3A{set_code}&unique=prints"
    response = requests.get(url)
    
    if response.status_code == 200:
        cards_data = response.json()
        card_name = [card['name'] for card in cards_data['data']]
        card_price = [card.get('prices', {}).get('usd') for card in cards_data['data']]
        while cards_data['has_more']:
            next_page_url = cards_data['next_page']
            response = requests.get(next_page_url)
            if response.status_code == 200:
                cards_data = response.json()
                card_name.extend([card['name'] for card in cards_data['data']])
                card_price.extend([card.get('prices', {}).get('usd') for card in cards_data['data']])
            else:
                print("Failed to fetch additional cards from Scryfall")
                break
        
        return card_name, card_price
    else:
        print("Failed to fetch cards from Scryfall")
        return []


def getContours(img, imgContour, originalImg, imgConts, card_names, card_prices ,min_area=35000):
    
    contours, _ = cv2.findContours(img, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
    width, height = 500, 700
    price = ''
    text = ''
    for cnt in contours:
        area = cv2.contourArea(cnt)
        peri = cv2.arcLength(cnt, True)
        approx = cv2.approxPolyDP(cnt, 0.02 * peri, True)
        if area > min_area and len(approx) >= 4:
            #print(area, len(approx))
            cv2.drawContours(imgConts, cnt, -1, (255, 0, 255), 7)
            rectX, rectY, rectW, rectH = cv2.boundingRect(approx)
            cv2.rectangle(imgContour, (rectX, rectY), (rectX + rectW, rectY + rectH), (0, 255, 0), 5)
            if len(approx) > 4:
                continue
            points = []
            for point in approx:
                x, y = point[0]
                points.append([x, y])
            card = np.float32(points)
            x1, y1 = points[0]
            x2, y2 = points[1]
            x4, y4 = points[3]

            if np.sqrt(np.square(x1 - x2) + np.square(y1 - y2)) < np.sqrt(np.square(x1 - x4) + np.square(y1 - y4)):
                cardWarped = np.float32([[width, 0], [0, 0], [0, height], [width, height]])
            else:
                cardWarped = np.float32([[0, 0], [0, height], [width, height], [width, 0]])
            matrix = cv2.getPerspectiveTransform(card, cardWarped)
            imgOutput = cv2.warpPerspective(originalImg, matrix, (width, height))
            
            text, price = getPrediction(imgOutput, card_names, card_prices)

            if text == "Not Found in Chosen Set":
                textColor = (0, 0, 255)
            else:
                textColor = (255, 50, 0)
            cv2.putText(imgContour, (text + " " + price), (rectX, rectY - 20), cv2.FONT_HERSHEY_COMPLEX, .7,
                        textColor, 2)
    return text, price
            


def getPrediction(img, card_names, card_prices, card_title_pos=(40, 90, 34, 400)):
    '''
    Returns the name of the card and its price. Performs OCR on the card title to get the card name.
    
    :param img: Image of the card.
    :param card_names: List of card names.
    :param card_prices: List of card prices.
    :return: A tuple containing the card name and its price.
        - closest_match: The closest match of the card name in the list of card names.
        - price: The price of the card.
    '''
    #card_title = img[25:75, 34:400]
    card_title = img[card_title_pos[0]:card_title_pos[1], card_title_pos[2]:card_title_pos[3]]

    card_name = re.sub('[^a-zA-Z0-9,+ ]', '', pytesseract.image_to_string(card_title))
    print(card_name)
    closest_match = difflib.get_close_matches(card_name, card_names)

    if len(closest_match) >= 1:
        closest_match = closest_match[0]
        idx = card_names.index(closest_match)
        price = re.sub('[^0-9$.]', '', card_prices[idx])
    else:
        closest_match = "Not Found in Chosen Set"
        price = ""

    return closest_match, price
    
def getCardName(img, card_names, card_prices, thresh1=100, thresh2=140):
    '''
    Returns the name of the card and its price.
    
    :param img: Image of the card.
    :param card_names: List of card names.
    :param card_prices: List of card prices.
    :param thresh1: Threshold 1 for Canny Edge Detection.
    :param thresh2: Threshold 2 for Canny Edge Detection.
    :return: A tuple containing the card name and its price.
        - cardName: The name of the card.
        - imgContour: Image with contours drawn on it.
    '''
    mask = cv2.imread('white_mask.png')
    #mask = np.hstack([mask, mask, mask])
    img = img * mask
    imgContour = img.copy()
    imgConts = img.copy()

    imgBlur = cv2.GaussianBlur(img, (5, 5), 0)
    imgGray = cv2.cvtColor(imgBlur, cv2.COLOR_BGR2GRAY)

    imgCanny = cv2.Canny(imgGray, thresh1, thresh2)
    kernel = np.ones((5, 5), np.uint8)
    imgDil = cv2.dilate(imgCanny, kernel, iterations=1)

    cardName, _ = getContours(imgDil, imgContour, img, imgConts, card_names, card_prices)

    return cardName, imgContour

#================================================================================================
#================================================================================================

def stackImages(scale, imgArray):
    rows = len(imgArray)
    cols = len(imgArray[0])
    rowsAvailable = isinstance(imgArray[0], list)
    width = imgArray[0][0].shape[1]
    height = imgArray[0][0].shape[0]
    if rowsAvailable:
        for x in range(0, rows):
            for y in range(0, cols):
                if imgArray[x][y].shape[:2] == imgArray[0][0].shape[:2]:
                    imgArray[x][y] = cv2.resize(imgArray[x][y], (800, 600), None, scale, scale)
                else:
                    imgArray[x][y] = cv2.resize(imgArray[x][y], (imgArray[0][0].shape[1], imgArray[0][0].shape[0]),
                                                None, scale, scale)
                if len(imgArray[x][y].shape) == 2: imgArray[x][y] = cv2.cvtColor(imgArray[x][y], cv2.COLOR_GRAY2BGR)
        imageBlank = np.zeros((height, width, 3), np.uint8)
        hor = [imageBlank] * rows
        hor_con = [imageBlank] * rows
        for x in range(0, rows):
            hor[x] = np.hstack(imgArray[x])
        ver = np.vstack(hor)
    else:
        for x in range(0, rows):
            if imgArray[x].shape[:2] == imgArray[0].shape[:2]:
                imgArray[x] = cv2.resize(imgArray[x], (0, 0), None, scale, scale)
            else:
                imgArray[x] = cv2.resize(imgArray[x], (imgArray[0].shape[1], imgArray[0].shape[0]), None, scale, scale)
            if len(imgArray[x].shape) == 2: imgArray[x] = cv2.cvtColor(imgArray[x], cv2.COLOR_GRAY2BGR)
        hor = np.hstack(imgArray)
        ver = hor
    return ver



def empty(a):
    pass


def main():
    set_names, set_codes = list_all_mtg_sets()

    # creating a multi choice box
    setChoice = choicebox("Selected any set from the list given below", "Magic the Gathering Sets", set_names)
    idx = set_names.index(setChoice)
    set_code = set_codes[idx]
    cards, prices = get_cards_in_set(set_code)

    frameWidth = 1280
    frameHeight = 960
    cap = cv2.VideoCapture(0)
    cap.set(3, frameWidth)
    cap.set(4, frameHeight)
    
    cv2.namedWindow("Parameters")
    cv2.resizeWindow("Parameters", 640, 180)
    cv2.createTrackbar("Threshold1", "Parameters", 100, 255, empty)
    cv2.createTrackbar("Threshold2", "Parameters", 140, 255, empty)
    cv2.createTrackbar("Area", "Parameters", 35000, 100000, empty)

    if not cap.isOpened():
        raise IOError("Cannot open webcam")

    
    while True:
        #success, img = cap.read()
        img = cv2.imread('test2.png')#[350:790,620:1000]
        imgContour = img.copy()
        imgConts = img.copy()

        imgBlur = cv2.GaussianBlur(img, (5, 5), 0)
        imgGray = cv2.cvtColor(imgBlur, cv2.COLOR_BGR2GRAY)

        threshold1 = cv2.getTrackbarPos("Threshold1", "Parameters")
        threshold2 = cv2.getTrackbarPos("Threshold2", "Parameters")
        minArea = cv2.getTrackbarPos("Area", "Parameters")
        imgCanny = cv2.Canny(imgGray, threshold1, threshold2)
        kernel = np.ones((5, 5), np.uint8)
        imgDil = cv2.dilate(imgCanny, kernel, iterations=1)

        _,_,corr_img = getContours(imgDil, imgContour, img, imgConts, cards, prices, min_area=minArea)

        imgStack = stackImages(0.8, ([img, imgGray, imgCanny],
                                    [imgConts, imgContour, corr_img]))
        #cv2.imshow("MTG Price Lookup OpenCV Project", imgContour)
        # If you'd like to see how the sliders are changing how the system views the card, uncomment next line
        cv2.imshow('Full Explanation', imgStack)
        
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
        
if __name__ == "__main__":
    main()