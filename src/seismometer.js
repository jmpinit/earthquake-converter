const FeedMe = require('feedme');
const https = require('https');
const EventEmitter = require('events').EventEmitter;

const RECENT_PERIOD = 5 * 60 * 1000; // ms
const earthquakeFeed = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.atom';

function mapCategories(categories) {
  return categories.reduce((catMap, category) => {
    return Object.assign({}, catMap, { [category.label]: category.term });
  }, {});
}

// watch for earthquakes
class Seismometer extends EventEmitter {
  constructor(period) {
    super();

    this.pollingPeriod = period || 1000;
  }

  checkForEarthquakes() {
    const parse = quakeItem => {
      const info = mapCategories(quakeItem.category);

      // parse magnitude from title because it's more precise there
      const magnitude = parseFloat(/M (-?\d+\.\d+)/.exec(quakeItem.title)[1]);

      const locationParts = quakeItem['georss:point'].split(/\s/);
      const latitude = parseFloat(locationParts[0]);
      const longitude = parseFloat(locationParts[1]);

      return {
        date: new Date(Date.parse(quakeItem.updated)),
        magnitude,
        latitude,
        longitude,
      }
    };

    https.get(earthquakeFeed, res => {
      if (res.statusCode !== 200) {
        console.log(`Earthquake API server returned non-OK status code ${res.statusCode}`);
        return;
      }

      const parser = new FeedMe();

      parser.on('updated', updateTime => {
        if (updateTime !== this.lastUpdateTime) {
          this.lastUpdateTime = updateTime;
        }
      })

      parser.on('item', item => {
        const quake = parse(item);

        if (this.lastQuake === undefined) {
          // prime the watcher
          this.lastQuake = quake;
        }

        const happenedRecently = (Date.now() - quake.date.getTime()) < RECENT_PERIOD;

        if (this.lastQuake.date.getTime() < quake.date.getTime() && happenedRecently) {
          this.emit('quake', quake);
          this.lastQuake = quake;
        }
      });

      res.pipe(parser);
    });
  }

  watch() {
    this.pollingId = setInterval(() => this.checkForEarthquakes(), this.pollingPeriod);
  }

  stopWatching() {
    clearInterval(this.pollingId);
    this.pollingId = undefined;
  }
}

module.exports = Seismometer;
