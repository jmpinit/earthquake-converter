# Earthquake Converter

Pulls live earthquake data from the [US Geological Survey site](http://earthquake.usgs.gov/) and
sends information about each event to connected serial devices.

![:)](http://i.imgur.com/1DbNcsf.gif)

## Installation on Raspberry Pi B+

**With ResinOS:**

[ResinOS](https://resinos.io/) offers a stripped down operating system which starts up quickly,
restarts the app when it fails, and is more robust to filesystem corruption.

1. Download [ResinOS](https://resinos.io/#downloads) for Raspberry Pi 1
2. Extract and install ResinOS image on micro SD card
3. Connect Raspberry Pi to network and power
4. Install the [resin device toolbox](https://github.com/resin-os/resin-device-toolbox)
(`npm install -g resin-device-toolbox`)
5. Run `rdt push` in the root of this repo and select your Raspberry Pi when prompted

**On Top of Raspbian:**

**Dependencies:**

* [Node.js](https://nodejs.org/en/) (v5 or greater) - can be installed on Raspbian using [these
instructions](https://gist.github.com/jmptable/a7b985ea2d812deab6f1a3eaa5f0ee41).

1. Clone the repo (`git clone https://github.com/jmptable/earthquake-converter`)
2. `cd earthquake-converter`
3. `npm install`
4. `node src`

## Serial Protocol

When earthquakes occur the time, magnitude, latitude, and longitude will be written to the first
serial port found, in that order. The values will be floats separated by a single space and
terminated with a newline. Time is given as seconds since 00:00:00 UTC
([Unix Time](https://en.wikipedia.org/wiki/Unix_time)). Magnitude is measured on the Richter scale.

There is a newline sent at the start of the program to make it easier to reset state in the hardware.

For an example of parsing this data with an Arduino take a look at the earthquake-light firmware in
the examples directory.

## Using With Raspberry Pi Hardware Serial

First make sure that the serial port is not configured to be connected to the kernel message buffer.
To accomplish that you can run `sudo raspi-config` and then select "Advanced Options" ->
"Serial Enable/Disable shell...". After a reboot the hardware serial port should be free to use.
Find the path to the port and then run the earthquake converter with `node src --port /dev/your-port`.
