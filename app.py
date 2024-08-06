import tkinter as tk
from tkinter import ttk
from PIL import Image, ImageTk

def update_image(event):
    selected_option = dropdown.get()
    if selected_option == "Option 1":
        img = Image.open("capture.png")
    elif selected_option == "Option 2":
        img = Image.open("path_to_image2.jpg")
    else:
        img = Image.open("path_to_default_image.jpg")
    
    img = img.resize((800, 600), Image.LANCZOS)
    img_tk = ImageTk.PhotoImage(img)
    image_label.config(image=img_tk)
    image_label.image = img_tk

# Create the main window
root = tk.Tk()
root.title("Image Viewer")

# Create a frame to hold the dropdown and buttons
frame = tk.Frame(root)
frame.pack(pady=10)

# Create a dropdown menu
options = ["Option 1", "Option 2", "Option 3"]
dropdown = ttk.Combobox(frame, values=options)
dropdown.current(0)
dropdown.pack(side=tk.LEFT, padx=5)

# Create two buttons
button1 = tk.Button(frame, text="Button 1")
button1.pack(side=tk.LEFT, padx=5)

button2 = tk.Button(frame, text="Button 2")
button2.pack(side=tk.LEFT, padx=5)

# Create a label to display the image
image_label = tk.Label(root)
image_label.pack(pady=10)

# Bind the dropdown menu to the update_image function
dropdown.bind("<<ComboboxSelected>>", update_image)

# Initialize with the first image
update_image(None)

# Run the application
root.mainloop()