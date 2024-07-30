import cv2
from MTGCardDetection import getCardName, getSetMap

setMap, cardBank = getSetMap()

cap = cv2.VideoCapture(0)
cap.set(3, 1280)
cap.set(4, 960)
while True:
    _, img = cap.read()
    name, img_new = getCardName(img, setMap, cardBank)
    cv2.imshow('img', img_new)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break
    
# 40 stepper
# 5 servo
# 10 camera
# 10 powersupply
# 4 arduino