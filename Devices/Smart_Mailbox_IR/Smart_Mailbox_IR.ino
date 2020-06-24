#include "WiFi.h"
#include<ArduinoJson.h>
#include<PubSubClient.h>
#define MQTT_SERVER "DrSmrtnik"
#define MQTT_PASSWORD "mqttpassword"

WiFiClient wifiClient;
PubSubClient client(wifiClient);

const char* ssid = "Boki";//Wifi ssid
const char* password = "01011962";//Wifi password

bool mail = false;



const int trigPin1 = 2;  //D4 pins
const int echoPin1 = 5;  //D3

const int trigPin2 = 19;  //D5
const int echoPin2 = 18  ;  //D6

long duration;
float distance;
#define MAX_DISTANCE 200//cm max-400/500
// define the timeOut according to the maximum range. timeOut= 2*MAX_DISTANCE /100 /340
//*1000000 = MAX_DISTANCE*58.8
float timeOut = MAX_DISTANCE * 60;
int soundVelocity = 340; //speed of air =const = 340ms



int sleepTimeS = 3600;

void setup() {
  client.setServer("io.adafruit.com", 1883);
  Serial.begin(115200);
  Serial.print("connecting to ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);//starting connection to wifi
  while (WiFi.status() != WL_CONNECTED) { //Waiting to connect to wifi
    delay(1000);
    Serial.print(". ");
  }
  Serial.println("CONNECTED! ");

  pinMode(trigPin1, OUTPUT); // Sets the trigPin1 as an Output
  pinMode(echoPin1, INPUT); // Sets the echoPin1 as an Input
  pinMode(trigPin2, OUTPUT); // Sets the trigPin2 as an Output
  pinMode(echoPin2, INPUT); // Sets the echoPin2 as an Input
  while (!client.connected()) {
    reconnect();
  }
  String test = "mailbox";
  client.publish("DrSmrtnik/feeds/mailbox,MAILBOX", test.c_str());
}

void loop() {
  yield();
  if (!client.connected()) {
    reconnect();
  }
  client.loop();
  bool dist1 = sendNotification(getSonar(trigPin1, echoPin1));
  delay(2500);
  bool dist2 = sendNotification(getSonar(trigPin2, echoPin2));
  StaticJsonDocument<50> doc;

  if (( dist1 || dist2)) //If mail is recieved for the first time, send an email
  {
    Serial.println("GOT MAIL");
    mail = true;
    doc["mail"] = true;
    char buffer[20];
    size_t n = serializeJson(doc, buffer);
    client.publish("DrSmrtnik/f/mailboxResponse", buffer, n);
  } else if (!dist1 && !dist2) //if there is nothing in the mailbox
  {

    Serial.println("REMOVED MAIL");
    mail = false;
    doc["mail"] = false;
    char buffer[20];
    size_t n = serializeJson(doc, buffer);
    client.publish("DrSmrtnik/f/mailboxResponse", buffer, n);
  }
  //  ESP.deepSleep(sleepTimeS * 1000000);
}

float getSonar(int trigPin, int echoPin) { //measure and calculate distance from sensors
  unsigned long pingTime;
  float distance;
  Serial.println("TRIG PIN FROM  sensor");
  Serial.println(trigPin);
  digitalWrite(trigPin, HIGH); // make trigPin output high level lasting for 10μs to triger HC_SR04
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  pingTime = pulseIn(echoPin, HIGH, timeOut); // Wait HC-SR04 returning to the high level and measure out this waitting time
  distance = (float)pingTime * soundVelocity / 2 / 10000; //calculate the distance
  //  Serial.println("Distance: ");
  Serial.println(distance);
  //  Serial.println("From pin: ");
  //  Serial.println(trigPin);
  return distance;
}

bool sendNotification(float distance) //check if there is something in the mailbox
{
  if (distance < 7.5 || distance > 9) // the distance from the mailbox door
    return true;
  return false;
}

void reconnect() {
  // Loop until we're reconnecte  d
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    if (client.connect("ESP32", MQTT_SERVER, MQTT_PASSWORD)) {
      Serial.println("connected");
      // Once connected, publish an announcement...
      //      client.subscribe(SUBSCRIBE);
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}
