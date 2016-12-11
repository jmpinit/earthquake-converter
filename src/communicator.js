const SerialPort = require('serialport');

function getFirstPort() {
  return new Promise((fulfill, reject) => {
    SerialPort.list((err, ports) => {
      if (err) {
        reject(err);
        return;
      }

      const realPorts = ports.filter(port => port.comName.indexOf('Bluetooth') === -1);

      fulfill(realPorts[0].comName);
    });
  });
}

class Communicator {
  connect() {
    return getFirstPort().then(comName => {
      this.port = new SerialPort(comName, { baudRate: 115200 });

      // reset at start
      this.port.on('open', () => this.port.write('\n'));
    });
  }

  send(info) {
    const msg = `${info.date} ${info.magnitude} ${info.latitude} ${info.longitude}\n`;
    this.port.write(Buffer.from(msg, 'ascii'));
  }
}

module.exports = Communicator;
