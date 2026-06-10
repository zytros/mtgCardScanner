#include <Servo.h>

Servo servo1;
Servo servo2;

const int servo1Pin = 9;
const int servo2Pin = 10;
const int lightSensorPin = A0;

const int stopValue = 90;
const int servo1ForwardValue = 170; // Slightly slower than servo 2
const int servo2ForwardValue = 180; // Faster forward motion
const int lightDropThreshold = 120;
const unsigned long stopDelayMs = 500;
const unsigned long maxRunTimeMs = 5000;

void setup() {
  Serial.begin(9600);
  servo1.attach(servo1Pin);
  servo2.attach(servo2Pin);

  servo1.write(stopValue);
  servo2.write(stopValue);

  Serial.println("Arduino ready. Send 'get_card' to run getCard().");
}

void loop() {
  if (Serial.available() > 0) {
    String command = Serial.readStringUntil('\n');
    command.trim();

    if (command == "get_card") {
      getCard();
    } else if (command.startsWith("move_bin")) {
      int binNumber = 0;
      String binValue = command.substring(8);
      binValue.trim();
      if (binValue.length() > 0) {
        binNumber = binValue.toInt();
      }
      moveToBin(binNumber);
    }
  }
}

void getCard() {
  Serial.println("getCard() started");

  servo1.write(servo1ForwardValue);
  servo2.write(servo2ForwardValue);

  int baselineLight = analogRead(lightSensorPin);
  unsigned long startTime = millis();
  bool lightDropDetected = false;

  while (!lightDropDetected && (millis() - startTime < maxRunTimeMs)) {
    int currentLight = analogRead(lightSensorPin);

    if (baselineLight - currentLight > lightDropThreshold) {
      lightDropDetected = true;
      break;
    }
  }

  if (lightDropDetected) {
    servo1.write(stopValue);
    delay(stopDelayMs);
    servo2.write(stopValue);
    Serial.println("Light drop detected. Servos stopped.");
  } else {
    servo1.write(stopValue);
    servo2.write(stopValue);
    Serial.println("No light drop detected within timeout. Servos stopped.");
  }

  Serial.println("GET_CARD_DONE");
}

void moveToBin(int binNumber) {
  Serial.print("Moving to bin ");
  Serial.println(binNumber);
  delay(200);
  Serial.println("MOVE_BIN_DONE");
}
