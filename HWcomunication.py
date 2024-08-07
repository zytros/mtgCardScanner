LED = False
BIN = 0
HEIGHT = 0

def set_led(value):
    assert value in [0, 1], 'value must be 0 or 1'
    LED = True if value==1 else False
    print('led is on' if value==1 else 'led is off')
    call_arduino_function(1, value)

def led_toggle():
    led_on() if not LED else led_off()

def led_on():
    if LED:
        pass
    else:
        set_led(1)
        
def led_off():
    if not LED:
        pass
    else:
        LED = False
        set_led(0)
        
def set_bin(value):
    BIN = value
    print(f'bin set to {BIN}')
    call_arduino_function(2, value)
    
def swipe(num):
    print(f'swiped {num}')
    call_arduino_function(3, num)
    
def move_sledge(height):
    HEIGHT += height
    print(f'sledge moved to {HEIGHT} ')
    call_arduino_function(4, height)

import serial
import time

def call_arduino_function(function_id, value):
# Configure the serial port
    ser = serial.Serial('COM3', 9600, timeout=1)  # Adjust 'COM3' to your serial port
    time.sleep(2)  # Wait for the connection to be established

    # Send the function_id and value to the Arduino in the format "function_id,value"
    command = f"{function_id},{value}\n"
    ser.write(command.encode())

    # Read the response from the Arduino
    response = ser.readline().decode().strip()
    ser.close()

    return int(response)

if __name__ == "__main__":
# Example calls to different Arduino functions
    value1 = 5
    result1 = call_arduino_function(1, value1)
    print(f"Received from Arduino (function 1): {result1}")

    value2 = 7
    result2 = call_arduino_function(2, value2)
    print(f"Received from Arduino (function 2): {result2}")

    value3 = 12
    result3 = call_arduino_function(3, value3)
    print(f"Received from Arduino (function 3): {result3}")
