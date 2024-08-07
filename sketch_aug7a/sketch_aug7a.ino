#include <Arduino.h>

int function1(int value) {
  // LED to value
  return value * 2;
}

int function2(int value) {
  // set bin to value
  return value + 10;
}

int function3(int value) {
  // swipe swiper value
  return value - 5;
}

int function4(int value) {
  // move sledge 1/- amount
  return value - 5;
}

void setup() {
    Serial.begin(9600);
    while (!Serial) {
        ; // Wait for the serial port to connect. Needed for native USB
    }
}

void loop() {
    if (Serial.available() > 0) {
        String command = Serial.readStringUntil('\n'); // Read the incoming command
        int delimiterIndex = command.indexOf(',');
        if (delimiterIndex != -1) {
            int functionId = command.substring(0, delimiterIndex).toInt();
            int value = command.substring(delimiterIndex + 1).toInt();

            int result;
            switch (functionId) {
                case 1:
                    result = function1(value);
                    break;
                case 2:
                    result = function2(value);
                    break;
                case 3:
                    result = function3(value);
                    break;
                case 4:
                    result = function4(value);
                    break;
                default:
                    result = -1; // Unknown function
                    break;
            }
            Serial.println(result); // Send back the result
        }
    }
}
