const Communicator = require('../src/communicator');

function main() {
  const communicator = new Communicator();

  communicator.connect().then(() => {
    console.log('Connected to', communicator.port.path);

    setInterval(() => {
      const info = {
        date: Date.now(),
        magnitude: Math.random() * 10,
        latitude: Math.random() * 360 - 180,
        longitude: Math.random() * 360 - 180,
      };

      console.log(`Quake! At ${info.date} with a magnitude of ${info.magnitude}`);

      communicator.send(info);
    }, 5000);
  });
}

main();
