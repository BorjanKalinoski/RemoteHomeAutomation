#include <IRremoteESP8266.h>
#include <ir_Tcl.h>
#include <ESP8266WiFi.h>
#include <ArduinoJson.h>
#include<PubSubClient.h>

#define MQTT_SERVER "DrSmrtnik"
#define MQTT_PASSWORD "mqtt_pass"
#define PUBLISH "DrSmrtnik/f/AC1Response"
#define SUBSCRIBE "DrSmrtnik/f/AC1Control"

#define MODE_HEAT kTcl112AcHeat
#define MODE_COOL kTcl112AcCool
#define MODE_DRY kTcl112AcDry
#define MODE_FAN kTcl112AcFan
#define MODE_AUTO kTcl112AcAuto

#define FAN_LOW kTcl112AcFanLow
#define FAN_MED kTcl112AcFanMed
#define FAN_HI kTcl112AcFanHigh
#define FAN_AUTO kTcl112AcFanAuto

#define SWING_OFF kTcl112AcSwingVOff
#define SWING_ON kTcl112AcSwingVOn
#define LEGACY_TIMING_INFO false

void callback(char* topic, byte* payload, unsigned int length);

const char *ssiD = "wifiusername";
const char *passworD = "wifipassword";

const uint16_t kRecvPin = 2;
const uint16_t kIrLed = 4;  // ESP8266 GPIO pin to use. Recommended: 4 (D2).

IRTcl112Ac ac(kIrLed);
WiFiClient wifiClient;
PubSubClient client("io.adafruit.com", 1883, callback, wifiClient);

struct state {
  uint8_t temp = 22, fan = FAN_AUTO, operation = MODE_HEAT, swing = SWING_OFF;
  bool power = true;
};
state acState;

void callback(char* topic, byte* payload, unsigned int length) {

  StaticJsonDocument<256> doc;
  deserializeJson(doc, payload, length);

  acState.temp = doc["temp"];
  acState.fan = doc["fan"];
  acState.operation = doc["mode"];
  acState.swing = doc["swing"];
  acState.power = doc["power"];
  ac.setPower(acState.power);
  ac.setTemp(acState.temp);
  ac.setMode(acState.operation);
  ac.setFan(acState.fan);
  ac.setSwingVertical(acState.swing);
  ac.send();
  delay(500);
  char buffer[256];
  serializeJson(doc, buffer);
  Serial.println("PUBLISHING!");
  client.publish(PUBLISH, buffer);
  for (int i = 0; i < 3; i++) {
    digitalWrite(2, HIGH);
    delay(150);
    digitalWrite(2, LOW);
    delay(150);
  }
}
const uint8_t kTimeout = 50;
//#else   // DECODE_AC
//const uint8_t kTimeout = 15;
//#endif  // DECODE_AC

const uint16_t kMinUnknownSize = 12;



void reconnect() {
  // Loop until we're reconnected
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    if (client.connect("ESP8266", MQTT_SERVER, MQTT_PASSWORD)) {
      Serial.println("connected");
      // Once connected, publish an announcement...
      client.subscribe(SUBSCRIBE);
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}

void setup() {
  Serial.begin(115200);
  pinMode(2, OUTPUT);
  delay(100);
  Serial.println("Connecting to ");
  Serial.println(ssiD);
  WiFi.mode(WIFI_STA);
  WiFi.disconnect();
  WiFi.begin(ssiD, passworD);
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(" . ");
    delay(500);
  }
  Serial.println("Wifi connected, ip address: ");
  Serial.println(WiFi.localIP());

  ac.begin();

  while (!client.connected()) {
    reconnect();
  }

  String deviceData = "AC1,AC";
  client.publish("DrSmrtnik/f/AC1,AC", (char*) deviceData.c_str());
  for (int i = 0; i < 3; i++) {
    digitalWrite(2, HIGH);
    delay(150);
    digitalWrite(2, LOW);
    delay(150);
  }
}
void loop() {
  yield();
  if (!client.connected()) {
    reconnect();
  }

  client.loop();
}
