const SerialPort = require('serialport');

function getFirstPort() {
  return new Promise((fulfill, reject) => {
    SerialPort.list((err, ports) => {
      if (err) {
        reject(err);
        return;
      }

      const realPorts = ports.filter(port => port.comName.indexOf('Bluetooth') === -1);

      if (realPorts.length === 0) {
        reject(new Error('No valid port'));
      } else {
        fulfill(realPorts[0].comName);
      }
    });
  });
}

class Communicator {
  connect() {
    return getFirstPort().then(comName => {
      this.port = new SerialPort(comName, { baudRate: 115200 });

      // reset at start
      this.port.on('open', () => this.port.write('\n'));

      this.port.on('disconnect', () => {
        console.log('Serial port disconnected. Exiting...');
        process.exit(1);
      });

      this.port.on('close', () => {
        console.log('Serial port closed. Exiting...');
        process.exit(1);
      });
    });
  }

  send(info) {
    const unixTime = Math.floor(info.date.getTime() / 1000);
    const msg = `${unixTime} ${info.magnitude} ${info.latitude} ${info.longitude}\n`;
    const data = Buffer.from(msg, 'ascii');
    console.log('Sending', data.toString());
    this.port.write(data);
  }
}

module.exports = Communicator;
