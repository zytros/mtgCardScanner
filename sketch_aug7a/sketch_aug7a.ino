#include <Servo.h>

Servo servo1;
Servo servo2;

Servo sortServoSide;
Servo sortServoBottom;
Servo sortServoPusher;

const int servo1Pin = 9;
const int servo2Pin = 10;
const int lightSensorPin = A0;
const int sortServoSidePin = 8;
const int sortServoBottomPin = 5;
const int sortServoPusherPin = 6;

const int stopValue = 90;
const int servo1ForwardValue = 40; // Continuous rotation forward
const int servo2ForwardValue = 30; // Continuous rotation forward
const int lightDropThreshold = 30;
const unsigned long stopDelayMs = 1000;
const unsigned long maxRunTimeMs = 5000;

void setup() {
  Serial.begin(9600);

  // Initialize starting positions once, then detach all to conserve power
  sortServoSide.attach(sortServoSidePin);
  sortServoPusher.attach(sortServoPusherPin);
  sortServoBottom.attach(sortServoBottomPin);

  sortServoSide.write(120);
  sortServoPusher.write(90);
  sortServoBottom.write(100);
  
  delay(500); // Allow time to reach default positions

  sortServoSide.detach();
  sortServoPusher.detach();
  sortServoBottom.detach();

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

  // Attach intake servos only during card fetching
  servo1.attach(servo1Pin);
  servo2.attach(servo2Pin);

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

  // Detach intake servos to kill idle holding current
  servo1.detach();
  servo2.detach();

  Serial.println("GET_CARD_DONE");
}

void moveToBin(int binNumber) {
  if (binNumber == 0) {
    moveLeft();
  } else if (binNumber == 1) {
    moveRight();
  } else if (binNumber == 2) {
    moveDown();
  } else {
    Serial.println("number not detected");
  }
}

void moveLeft() {
  Serial.println("Moving Card left");
  
  // Actuate Side Gate
  sortServoSide.attach(sortServoSidePin);
  sortServoSide.write(0);
  delay(200); // Allow physical movement
  sortServoSide.detach();

  // Actuate Pusher
  sortServoPusher.attach(sortServoPusherPin);
  sortServoPusher.write(60);
  delay(500);
  sortServoPusher.write(90);
  delay(200);
  sortServoPusher.detach();

  // Reset Side Gate
  sortServoSide.attach(sortServoSidePin);
  sortServoSide.write(120);
  delay(200);
  sortServoSide.detach();
}

void moveRight() {
  Serial.println("Moving Card right");
  
  // Actuate Side Gate
  sortServoSide.attach(sortServoSidePin);
  sortServoSide.write(0);
  delay(500);
  sortServoSide.detach();

  // Actuate Pusher
  sortServoPusher.attach(sortServoPusherPin);
  sortServoPusher.write(120);
  delay(500);
  sortServoPusher.write(90);
  delay(200);
  sortServoPusher.detach();

  // Reset Side Gate
  sortServoSide.attach(sortServoSidePin);
  sortServoSide.write(120);
  delay(200);
  sortServoSide.detach();
}

void moveDown() {
  Serial.println("Moving card Down");
  
  sortServoBottom.attach(sortServoBottomPin);
  sortServoBottom.write(0);
  delay(700);
  sortServoBottom.write(100);
  delay(500); // Wait for flap to close before disabling holding torque
  sortServoBottom.detach();
}