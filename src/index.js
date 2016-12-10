const Seismometer = require('./seismometer');

function main() {
  const seismometer = new Seismometer();
  
  seismometer.on('quake', info => console.log(info));
  seismometer.watch();
}

main();
