#include "FastLED.h"
#define NUM_LEDS 8

CRGB leds[NUM_LEDS];

int brightness = 0;

void setup() {
  Serial.begin(115200);
  
  FastLED.addLeds<NEOPIXEL, 6>(leds, NUM_LEDS);
}

void updateLEDs() {
  for (int i = 0; i < 8; i++) {
    leds[i].r = brightness;
    leds[i].g = brightness >> 1;
    leds[i].b = 0;
  }
  
  FastLED.show();
}

void loop() {
  static String inString = "";
  static int infoIndex = 0;

  static float quakeTime, magnitude, latitude, longitude;

  static unsigned int t = 0;
  static long lastTick;

  static int animationPeriod;

  if (brightness > 0) {
    t--;
    t %= animationPeriod;

    if (t == 0) {
      brightness--;
      updateLEDs();
      t = animationPeriod;
    }
  }
  
  while (Serial.available()) {
    char c = Serial.read();

    if (c == ' ' || c == '\r' || c == '\n') {
      if (infoIndex == 0) {
        quakeTime = inString.toFloat();
      } else if (infoIndex == 1) {
        magnitude = inString.toFloat();
      } else if (infoIndex == 2) {
        latitude = inString.toFloat();
      } else if (infoIndex == 3) {
        longitude = inString.toFloat();
      }

      inString = "";
      infoIndex++;
    }

    if (c == '\r' || c == '\n') {
      brightness = 255;
      animationPeriod = magnitude * 100;

      Serial.print(quakeTime);
      Serial.print(", ");
      Serial.print(magnitude);
      Serial.print(", ");
      Serial.print(latitude);
      Serial.print(", ");
      Serial.println(longitude);

      inString = "";
      infoIndex = 0;
    } else {
      inString += c;
    }
  }
}
