
import serial
import time

class HWCommunication:
    def __init__(self, com):
        self.com = com
        self.LED = False
        self.BIN = 0
        self.HEIGHT = 0
        self.ser = self.open_serial()
        
    def led_toggle(self):
        self.led_on() if not self.LED else self.led_off()

    
    def set_led(self, value):
        assert value in [0, 1], 'value must be 0 or 1'
        self.LED = True if value==1 else False
        print('led is on' if value==1 else 'led is off')
        self.call_arduino_function(1, value)

    def led_on(self):
        if self.LED:
            pass
        else:
            self.set_led(1)
            
    def led_off(self):
        if not LED:
            pass
        else:
            LED = False
            self.set_led(0)
            
    def set_bin(self, value):
        amount = self.calc_move_amount(self.BIN, value)
        print(f'bin set from {self.BIN} to {value}')
        #shortcut
        self.call_arduino_function(2, value)
        self.BIN = value
        
    def swipe(self, num):
        print(f'swiped {num}')
        self.call_arduino_function(3, num)
        
    def move_sledge(self, height):
        print(f'sledge moved by {height} ')
        self.call_arduino_function(4, height)
        
    def move_stepper(self, steps):
        print(f'stepper moved {steps} steps')
        self.call_arduino_function(5, steps)

    def calc_move_amount(self, curr, target):
        mov_pos = (target - curr) % 16
        mov_neg = (curr - target) % 16
        return mov_pos if mov_pos < mov_neg else -mov_neg
    
    def open_serial(self):
        ser = serial.Serial(self.com, 9600, timeout=1)  
        time.sleep(4)
        ser.read_all()
        print('Serial opened')
        return ser

    def close_serial(self):
        self.ser.close()
        print('Serial closed')

    def call_arduino_function(self, function_id, value):
        # Send the function_id and value to the Arduino in the format "function_id,value"
        command = f"{function_id},{value}\n"
        self.ser.write(command.encode())
        # Read the response from the Arduino
        response=self.ser.read_all().decode().strip()
        while response == '':
            response=self.ser.read_all().decode().strip()
            time.sleep(0.1)
    
        return int(response)







if __name__ == "__main__":
# Example calls to different Arduino functions
    '''value1 = 5
    result1 = call_arduino_function(1, value1)
    print(f"Received from Arduino (function 1): {result1}")

    value2 = 7
    result2 = call_arduino_function(2, value2)
    print(f"Received from Arduino (function 2): {result2}")

    value3 = 12
    result3 = call_arduino_function(3, value3)
    print(f"Received from Arduino (function 3): {result3}")'''

