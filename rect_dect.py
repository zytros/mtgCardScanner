import cv2
import numpy as np
from mtg_ocr import predict_card, read_cardnames_from_file
from PIL import Image

def in_same_place(xs, ys, tol=15):
    """
    Returns True if all elements in the list are more or less in the same place.

    Args:
        xs ([x]): A list of x coordinates of top left corners.
        ys ([y]): A list of y coordinates of top left corners.
    """
    min_x = min(xs)
    max_x = max(xs)
    min_y = min(ys)
    max_y = max(ys)
    return max_x - min_x < tol and max_y - min_y < tol

def extract_content_from_points(image, points):
    """
    Extracts and transforms the content within four points to a rectangular perspective.

    Parameters:
    - image: The source image.
    - points: A list of four (x, y) tuples representing the corners of the content to extract.

    Returns:
    - The transformed image containing only the content within the specified points.
    """
    # Ensure points are in the correct order and are numpy arrays
    rect = np.zeros((4, 2), dtype="float32")
    s = points.sum(axis=1)
    rect[0] = points[np.argmin(s)]
    rect[2] = points[np.argmax(s)]
    diff = np.diff(points, axis=1)
    rect[1] = points[np.argmin(diff)]
    rect[3] = points[np.argmax(diff)]

    # Calculate the width and height of the new image
    (tl, tr, br, bl) = rect
    widthA = np.sqrt(((br[0] - bl[0]) ** 2) + ((br[1] - bl[1]) ** 2))
    widthB = np.sqrt(((tr[0] - tl[0]) ** 2) + ((tr[1] - tl[1]) ** 2))
    maxWidth = max(int(widthA), int(widthB))
    heightA = np.sqrt(((tr[0] - br[0]) ** 2) + ((tr[1] - br[1]) ** 2))
    heightB = np.sqrt(((tl[0] - bl[0]) ** 2) + ((tl[1] - bl[1]) ** 2))
    maxHeight = max(int(heightA), int(heightB))

    # Destination points are the corners of the new image
    dst = np.array([
        [0, 0],
        [maxWidth - 1, 0],
        [maxWidth - 1, maxHeight - 1],
        [0, maxHeight - 1]], dtype="float32")

    # Get the perspective transform matrix and apply it
    M = cv2.getPerspectiveTransform(rect, dst)
    warped = cv2.warpPerspective(image, M, (maxWidth, maxHeight))

    return warped

# Start capturing video from the webcam
cap = cv2.VideoCapture(1)
pos_x_queue = []
pos_y_queue = []
cardnames = read_cardnames_from_file("mh3.txt")

while True:
    # Read a new frame
    ret, img = cap.read()
    img_copy = img.copy()
    if not ret:
        break  # Break the loop if there are no frames to read

    # Convert to grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # Apply threshold
    ret, thresh = cv2.threshold(gray, 50, 255, 0)
    
    # Find contours
    contours, hierarchy = cv2.findContours(thresh, 1, 2)
    extracted_rectangles = []
    for i,cnt in enumerate(contours):
        x1, y1 = cnt[0][0]
        approx = cv2.approxPolyDP(cnt, 0.01*cv2.arcLength(cnt, True), True)
        if len(approx) == 4:
            x, y, w, h = cv2.boundingRect(cnt)
            if w < 20 or h < 20:
                continue
            extracted_rectangles.append(((x,y,w,h), cnt))
    correct_rect = None
    card_rects = []
    extracted_img = np.zeros((100, 100, 3), np.uint8)
    if not (len(extracted_rectangles) < 2 or len(extracted_rectangles) > 3):
        for rect in extracted_rectangles:
            ((x, y, w, h), cnt) = rect
            if w < 600:
                card_rects.append(rect)            
        if len(card_rects) == 0:
            continue
        if len(card_rects) == 1:
            correct_rect = card_rects[0]
        else:
            correct_rect = card_rects[0] if cv2.contourArea(card_rects[0][1]) > cv2.contourArea(card_rects[1][1]) else card_rects[1] 
        x, y, w, h = correct_rect[0]
        cnt = correct_rect[1]
        if len(pos_x_queue) > 20:
            pos_x_queue.pop(0)
            pos_y_queue.pop(0)
        pos_x_queue.append(x)
        pos_y_queue.append(y)
        print(len(pos_x_queue))
        color = (0, 255, 0) if in_same_place(pos_x_queue, pos_y_queue) else (0, 0, 255)
        img_copy = cv2.drawContours(img_copy, [cnt], -1, color, 3)
        corners = np.array([
                    cv2.approxPolyDP(cnt, 0.01*cv2.arcLength(cnt, True), True)[0][0], 
                    cv2.approxPolyDP(cnt, 0.01*cv2.arcLength(cnt, True), True)[1][0], 
                    cv2.approxPolyDP(cnt, 0.01*cv2.arcLength(cnt, True), True)[2][0], 
                    cv2.approxPolyDP(cnt, 0.01*cv2.arcLength(cnt, True), True)[3][0]])
        
        extracted_img = extract_content_from_points(img, corners)
        
        if in_same_place(pos_x_queue, pos_y_queue):
            rgb_image = cv2.cvtColor(extracted_img, cv2.COLOR_BGR2RGB)
            pil_image = Image.fromarray(rgb_image)
            cardname = predict_card(pil_image, cardnames)
            print(cardname)
            cv2.imwrite('extracted_image.png', extracted_img)
    
        
    #print(f"Number of rectangles: {num_rectangles}")
    # Display the frame
    height_img, width_img = img.shape[:2]
    height_extracted_img, width_extracted_img = extracted_img.shape[:2]

    # Resize extracted_img to match the height of img
    if height_img != height_extracted_img:
        extracted_img = cv2.resize(extracted_img, (int(width_extracted_img * (height_img / height_extracted_img)), height_img))

    # Stack both images horizontally
    combined_img = np.hstack((img_copy, extracted_img))

    # Display the combined image
    cv2.imshow("Original and Extracted Side by Side", combined_img)

    # Break the loop if 'q' is pressed
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Release the capture and close any open windows
cap.release()
cv2.destroyAllWindows()