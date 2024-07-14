#include <FastLED.h>

// -------------------
// Constants
#define NUM_LEDS 15
#define DATA_PIN 7

// -------------------
// Runtime variables

// LEDs in rainbow color: https://colorswall.com/palette/102
CRGB MY_LEDS[NUM_LEDS] = {
  { 0xff, 0x00, 0x00 },  // Red
  { 0xff, 0xa5, 0x00 },  // Orange
  { 0xff, 0xff, 0x00 },  // Yellow
  { 0x00, 0x80, 0x00 },  // Green
  { 0x00, 0x00, 0xff },  // Blue
  { 0x4b, 0x00, 0x82 },  // Indigo
  { 0xee, 0x82, 0xee },  // Violet
  { 0x00, 0x00, 0x00 },
  { 0x00, 0x00, 0x00 },
  { 0x00, 0x00, 0x00 },
  { 0x00, 0x00, 0x00 },
  { 0x00, 0x00, 0x00 },
  { 0x00, 0x00, 0x00 },
  { 0x00, 0x00, 0x00 },
  { 0x00, 0x00, 0x00 },
};

// Index used for animation
int index = 0;

// -------------------
// Functions

/**
 * Rotate the LEDs into the physical connector
 */
void rotate_in() {
  CRGB temp = MY_LEDS[0];
  for (int i = 0; i < NUM_LEDS - 1; i++) {
    MY_LEDS[i] = MY_LEDS[i + 1];
  }
  MY_LEDS[NUM_LEDS - 1] = temp;
}

/**
 * Rotate the LEDs out from the physical connector
 */
void rotate_out() {
  CRGB temp = MY_LEDS[NUM_LEDS - 1];
  for (int i = NUM_LEDS - 1; i > 0; i--) {
    MY_LEDS[i] = MY_LEDS[i - 1];
  }
  MY_LEDS[0] = temp;
}

/**
 * Setup function called once at power up
 */
void setup() {
  // Configure the LEDs to be controlled by the FastLED library
  // Using NEOPIXEL for the A035 LED strips from M5Stack
  FastLED.addLeds<NEOPIXEL, DATA_PIN>(MY_LEDS, NUM_LEDS);
  
  // Reduce overall brightness 
  FastLED.setBrightness(10);
  
  // "Render" the LEDs
  FastLED.show();
}

/**
 * Loop function called cyclically
 */
void loop() {
  // Do some animation with the LED colors
  if (index < (NUM_LEDS - 7)) {
    rotate_out();
  } else {
    rotate_in();
  }
  index = (index + 1) % (NUM_LEDS + 1);

  // Sleep a bit
  delay(100);

  // "Render" the LEDs
  FastLED.show();
}
