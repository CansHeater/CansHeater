#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>

#define TEMPIN_PIN D1
#define TEMPOUT_PIN D2
#define PWM_CONTROL D3
#define FAN_VCC D4
#define ANALOG_INPUT A0

/*
  Wiring :
  TEMPIN_PIN connects to first sensor's VCC
  TEMPOUT_PIN connects to second sensor's VCC
  PWM_CONTROL connects to fan PWM pin
  FAN_VCC connects to a relay connected to fan VCC pin
          (in order to shut it off completely)
  ANALOG_INPUT connects both sensor's lecture pins
  Connect both sensor's GND to any GND pin on esp8266
*/

// Set wifi settings here
const char* ssid = "";
const char* pass = "";

int status = WL_IDLE_STATUS;
String server = ""; // Server IP here
String port = "8080";
// Initialize the client libraries
WiFiClient client;
HTTPClient http;

// Request fan speed (raw text containing percentage value) from server
// Return the percentage value to set the fan at.
float requestFanSpeed() {
  Serial.println("\nRequesting fan speed...");
  http.begin("http://"+server+":"+port+"/info/fanspeed");
  int httpCode = http.GET();
  // httpCode will be negative on error
  if (httpCode > 0) {
    // HTTP header has been send and Server response header has been handled
    Serial.printf("[HTTP] GET... code: %d\n", httpCode);
    // file found at server
    if (httpCode == HTTP_CODE_OK) {
      String payload = http.getString();
      Serial.println("Received speed : "+payload+"%");
      return payload.toFloat();
    }
  } else {
    Serial.printf("[HTTP] GET... failed, error: %s\n", http.errorToString(httpCode).c_str());
  }
  http.end();
}

// Request the remaining sleep time in minutes from the server and return it.
int requestSleepTime() {
  Serial.println("\nRequesting remaining sleep time...");
  http.begin("http://"+server+":"+port+"/info/sleepTime");
  int httpCode = http.GET();
  // httpCode will be negative on error
  if (httpCode > 0) {
    // HTTP header has been send and Server response header has been handled
    Serial.printf("[HTTP] GET... code: %d\n", httpCode);
    // file found at server
    if (httpCode == HTTP_CODE_OK) {
      String payload = http.getString();
      Serial.println("Received remaining sleep time : "+payload+" minutes.");
      return payload.toInt();
    }
  } else {
    Serial.printf("[HTTP] GET... failed, error: %s\n", http.errorToString(httpCode).c_str());
  }
  http.end();
}

// post the data JSON-formatted to the server
void postData(String json) {
  Serial.println("\nPosting Data... : "+json);
  http.begin("http://"+server+":"+port+"/info");
  //Ajout du header pour prise en charge json
  http.addHeader("Content-Type", "application/json");
  int httpCode = http.POST(json);
  // httpCode will be negative on error
  if (httpCode > 0) {
    // HTTP header has been send and Server response header has been handled
    Serial.printf("[HTTP] POST... code: %d\n", httpCode);
    // file found at server
    if (httpCode == (HTTP_CODE_OK || HTTP_CODE_CREATED)) {
      String payload = http.getString();
      Serial.println(payload);
    }
  } else {
    Serial.printf("[HTTP] POST... failed, error: %s\n", http.errorToString(httpCode).c_str());
  }
  http.end();
}

void setup() {
    // put your setup code here, to run once:
    Serial.begin(115200);
    pinMode(TEMPIN_PIN, OUTPUT);
    pinMode(TEMPOUT_PIN, OUTPUT);
    pinMode(PWM_CONTROL, OUTPUT);
    pinMode(FAN_VCC, OUTPUT);
    pinMode(ANALOG_INPUT, INPUT);

    //Initialisation de la connexion WiFi
    Serial.print("Connecting to network : ");
    Serial.println(ssid);

    WiFi.begin(ssid, pass);
    while (WiFi.status() != WL_CONNECTED) {
      delay(500);
      Serial.print(".");
    }
    Serial.println("Connected to wifi");
}

float convertTemp(int analogTemp) {
  float R = 1023.0/analogTemp-1.0;
  R = 100000*R;
  return (1.0/(log(R/100000)/4275+1/298.15)-273.15)+10; // convert to temperature via datasheet
  // The +10 addition is a workaround because our sensors are subject to a resistance.
  // This is NOT accurate (need to do some physical calculus)
}

void loop() {
    // put your main code here, to run repeatedly:

    // Handle Temperature sensors
    // shutting off both sensors
    Serial.println("Gathering sensors information... This will take 12 seconds");
    digitalWrite(TEMPIN_PIN, LOW);
    digitalWrite(TEMPOUT_PIN, LOW);
    // and waiting a bit to discharge analog input
    delay(5000);
    // choosing tempIn sensor
    digitalWrite(TEMPIN_PIN, HIGH);
    digitalWrite(TEMPOUT_PIN, LOW);
    delay(1000);
    int tempIn = analogRead(ANALOG_INPUT);
    float temperatureIn = convertTemp(tempIn);
    // shutting off both sensors
    digitalWrite(TEMPIN_PIN, LOW);
    digitalWrite(TEMPOUT_PIN, LOW);
    // and waiting a bit to discharge analog input
    delay(5000);
    // choosing tempOut sensor
    digitalWrite(TEMPOUT_PIN, HIGH);
    digitalWrite(TEMPIN_PIN, LOW);
    delay(1000);
    int tempOut = analogRead(ANALOG_INPUT);
    float temperatureOut = convertTemp(tempOut);

    // Formatting data to send
    String json = "{\r\n\"tempIn\": "+String(temperatureIn)+",\r\n"
                      +"\"tempOut\": "+String(temperatureOut)+"\r\n}";
    postData(json);

    // Handle sleep mode
    int sleepTime = requestSleepTime();
    if (sleepTime != 0.0){
      Serial.println("I'm awake, but I'm going into deep sleep mode for "+String(sleepTime)+" minute(s)");
      digitalWrite(FAN_VCC, LOW); // Turning off fan
      ESP.deepSleep(sleepTime*6e7); // Converted to microseconds
    }
    Serial.println("I don't want to sleep now è_é");

    // Handle fan speed
    float speed = requestFanSpeed();
    int convertedSpeed = speed * 10.23;
    if(convertedSpeed == 0){
      digitalWrite(FAN_VCC, LOW);
    }
    else {
      digitalWrite(FAN_VCC, HIGH);
      analogWrite(PWM_CONTROL, convertedSpeed);
    }

    //Uncomment if you want to disconnect the wifi client everytime
    /*if (!client.connected()) {
      Serial.println();
      Serial.println("Disconnecting.");
      client.stop();
      for(;;)
        ;
    }*/

    // Delay between 2 cycles = 15 seconds (in real use put 5 minutes or more)
    delay(15*1000);
}
