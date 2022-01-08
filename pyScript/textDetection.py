import cv2
import numpy as np
import pytesseract
from PIL import ImageGrab
import pyautogui

pytesseract.pytesseract.tesseract_cmd = 'C:\\Program Files\\Tesseract-OCR\\tesseract.exe'

def isAnalyzing():
    screenTop = np.array(ImageGrab.grab(bbox=(800,300,1700,1200)))
    imgTop = cv2.cvtColor(screenTop, cv2.COLOR_BGR2GRAY)
    imgLoading = cv2.imread("scanning24.png")
    imgLoading = cv2.cvtColor(imgLoading, cv2.COLOR_BGR2GRAY)
    tot = 0
    for i in range(899):
        for j in range(899):
            tot = tot + abs(imgTop[i][j] - imgLoading[i][j])
    if tot < 25000000:
        return True
    return False

def getScreenImg():
    screen = np.array(ImageGrab.grab(bbox=(800, 1250, 1700, 1360)))
    img = cv2.cvtColor(screen, cv2.COLOR_BGR2RGB)
    return img

def skip(a):
    pass

def startexec():
    pyautogui.click(1250,750)
    while isAnalyzing():
        skip(1)
    img = getScreenImg()
    print(pytesseract.image_to_string(img))


startexec()

