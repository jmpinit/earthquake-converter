# Earthquake Converter

Pulls live earthquake data from the [US Geological Survey site](http://earthquake.usgs.gov/) and sends information about each event to connected serial devices.

![:)](http://i.imgur.com/1DbNcsf.gif)

## Installation on Raspberry Pi B+

**With ResinOS:**

[ResinOS](https://resinos.io/) offers a stripped down operating system which starts up quickly, restarts the app when it fails, and is more robust to filesystem corruption.

1. Download [ResinOS](https://resinos.io/#downloads) for Raspberry Pi 1.
2. Extract and install ResinOS image on micro SD card.
3. Connect Raspberry Pi to network and power.
4. Install the [resin device toolbox](https://github.com/resin-os/resin-device-toolbox) (`npm install -g resin-device-toolbox`).
5. Run `rdt push` in the root of this repo and select your Raspberry Pi when prompted.

**On Top of Raspbian:**

1. Clone the repo
2. `npm install`
3. `npm start`

## Serial Protocol

When earthquakes occur the time, magnitude, latitude, and longitude will be written to the first serial port found, in that order. The values will be floats separated by a single space and terminated with a newline.

For an example of parsing this data with an Arduino take a look at the earthquake-light firmware in the examples directory.
