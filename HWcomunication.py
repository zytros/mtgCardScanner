LED = False
BIN = 0
HEIGHT = 0

def led_toggle():
    led_on() if not LED else led_off()

def led_on():
    if LED:
        pass
    else:
        LED = True
        print('led_on')
        
def led_off():
    if not LED:
        pass
    else:
        LED = False
        print('led_off')
        
def set_bin(value):
    BIN = value
    print(f'bin set to {BIN}')
    
def swipe(num):
    print(f'swiped {num}')
    
def move_sledge(height):
    HEIGHT += height
    print(f'sledge moved to {HEIGHT} ')