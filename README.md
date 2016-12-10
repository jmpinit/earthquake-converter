# Earthquake Converter

Pulls live earthquake data from the [US Geological Survey site](http://earthquake.usgs.gov/) and sends information about each event to connected serial devices.

## Serial Protocol

When earthquakes occur the time, magnitude, latitude, and longitude will be written to the first serial port found, in that order. The values will be floats separated by a single space and terminated with a newline.

For an example of parsing this data with an Arduino take a look at the earthquake-light firmware in the examples directory.
