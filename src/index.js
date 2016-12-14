const fs = require('fs');
const dns = require('dns');
const argv = require('yargs').argv;
const Seismometer = require('./seismometer');
const Communicator = require('./communicator');

function assertOnline() {
  return new Promise((fulfill, reject) => {
    dns.resolve('www.google.com', err => {
      if (err) {
        reject(new Error('Not online. Cannot resolve www.google.com'));
      } else {
        fulfill();
      }
    });
  });
}

function main() {
  if (argv.help) {
    console.log('usage: npm run [--port /dev/port]');
    process.exit(0);
  }

  if (argv.port) {
    if (!fs.existsSync(argv.port)) {
      console.error(`Port "${argv.port}" does not exist.`);
      process.exit(1);
    }
  }

  const communicator = new Communicator();

  const seismometer = new Seismometer();
  seismometer.watch();

  assertOnline()
    .then(() => communicator.connect(argv.port))
    .then(() => {
      console.log('Connected to', communicator.port.path);

      seismometer.on('quake', info => {
        console.log(`Quake! At ${info.date} with a magnitude of ${info.magnitude}`);
        communicator.send(info);
      });

      console.log('Watching for quakes...');
    })
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
}

main();
