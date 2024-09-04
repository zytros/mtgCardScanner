#include <Arduino.h>
#include <Servo.h>
#include <Adafruit_MotorShield.h>

Adafruit_MotorShield AFMS = Adafruit_MotorShield();

Adafruit_StepperMotor *stepper1 = AFMS.getStepper(200, 2); // bin Disk
Adafruit_StepperMotor *stepper2 = AFMS.getStepper(200, 1); // sledge

Servo SERVO_1; // pin 8
Servo SERVO_2; // pin 9
int LEDS_pin = 12;
int ENDSTOPPER_1 = 10; // upper
int ENDSTOPPER_2 = 11; // bottom
int OPT_ENDSTOP_1 = 0;
int OPT_ENDSTOP_2 = 1;
int OPT_ENDSTOP_3 = 2;
int OPT_ENDSTOP_4 = 3;

int currBin = 0;
int currHeight = 0;

inline int positive_modulo(int i, int n) {
    return (i % n + n) % n;
}

void blockingServoWrite(Servo servo, int value){
  servo.write(value);
  while(servo.read() != value);
}

int optIsActive(int val){
  if (val > 500) return 1;
  else return 0;
}

int getActiveBin(){
  int b0 = optIsActive(analogRead(OPT_ENDSTOP_1));
  int b1 = optIsActive(analogRead(OPT_ENDSTOP_2));
  int b2 = optIsActive(analogRead(OPT_ENDSTOP_3));
  int b3 = optIsActive(analogRead(OPT_ENDSTOP_4));
  int ret = b0 | (b1 << 1) | (b2 << 2) | (b3 << 3);
  return ret;
}

int setLED(int value) {
  // LED to value
  digitalWrite(LEDS_pin, value);
  return 0;
}

int setBin(int value){
  if (currBin == value) return 0;
  int mov_pos = positive_modulo((value - currBin), 16);
  int mov_neg = positive_modulo((currBin - value), 16);
  if (mov_neg < 0 || mov_pos < 0) return -1; // assert
  int mov = 0;
  if (mov_pos <= mov_neg){
    stepper1->step(mov_pos*200, FORWARD, DOUBLE);
  }else{
    stepper1->step(mov_neg*200, BACKWARD, DOUBLE);
  }
  currBin = value;
  return 0;
}

int setBin_old(int value) {
  // set bin to value
  if (value == 0) return 1;
  if (currBin == value) return 0;
  int mov_pos = (value - currBin) % 16;
  int mov_neg = (currBin - value) % 16;
  int mov = 0;
  if (mov_pos <= mov_neg){
    while(getActiveBin() != value){
      stepper1->step(1, FORWARD, DOUBLE);
    }
  }else{
    while(getActiveBin() != value){
      stepper1->step(1, BACKWARD, DOUBLE);
    }
  }
  currBin = value;
  return 0;
}

int swipe(int value) {
  // swipe swiper value
  if(value == 0){
    for (int pos = 0; pos <= 120; pos += 10) { // goes from 0 degrees to 120 degrees
      SERVO_1.write(pos);              // tell servo to go to position in variable 'pos'
      delay(15);                       // waits 15ms for the servo to reach the position
    }for (int pos = 120; pos >= 0; pos -= 10) { 
      SERVO_1.write(pos);              // tell servo to go to position in variable 'pos'
      delay(15);                       // waits 15ms for the servo to reach the position
    }
    return 0;
  }else if(value == 1){
    for (int pos = 0; pos <= 120; pos += 10) { // goes from 0 degrees to 120 degrees
      SERVO_2.write(pos);              // tell servo to go to position in variable 'pos'
      delay(15);                       // waits 15ms for the servo to reach the position
    }for (int pos = 120; pos >= 0; pos -= 10) { 
      SERVO_2.write(pos);              // tell servo to go to position in variable 'pos'
      delay(15);                       // waits 15ms for the servo to reach the position
    }
    return 0;
  }
  return 1;
}

int moveSledge(int value){
  if(value < 0){
    stepper2->step(-value, BACKWARD, DOUBLE);
  }else{
    stepper2->step(value, FORWARD, DOUBLE);
  }
  return 0;
}

int moveSledge_old(int value) {
  // move sledge +/- amount
  // pos => up, neg => down
  if (value >= 0){
    for (int i = 0; i < value; i++){
      if(digitalRead(ENDSTOPPER_1) == HIGH) {
        stepper2->step(3, BACKWARD, DOUBLE);
        break;
      }
        stepper2->step(1, FORWARD, DOUBLE);
    }
    return 0;
  }else{
    for (int i = 0; i < value; i++){
      if(digitalRead(ENDSTOPPER_2) == HIGH) {
        stepper2->step(3, FORWARD, DOUBLE);
        break;
      }
        stepper2->step(1, BACKWARD, DOUBLE);
    }
    return 0;
  }
}

void setup() {
  Serial.begin(9600);
  while (!Serial);

  if (!AFMS.begin()) {
    Serial.println("Could not find Motor Shield. Check wiring.");
    while (1);
  }
  Serial.println("Motor Shield found.");
  stepper1->setSpeed(255);
  stepper2->setSpeed(255);

  SERVO_1.attach(8);
  SERVO_2.attach(9);
  pinMode(12, OUTPUT);
  pinMode(10, INPUT);
  pinMode(11, INPUT);
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
          result = setLED(value);
          break;
        case 2:
          result = setBin(value);
          break;
        case 3:
          result = swipe(value);
          break;
        case 4:
          result = moveSledge(value);
          break;
        default:
          result = -1; // Unknown function
          break;
      }
        Serial.println(result); // Send back the result
    }
  }
}
