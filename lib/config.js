var Promise = require('bluebird');

module.exports = {
  denodeify: Promise.promisify,
  log: console.log,
  error: console.error,
  maxDistanceTrack: 50,
  isoDateFormat: 'YYYY-MM-DD[T]HH:mm:ss[Z]',
  dateFormat: 'DD/MM/YYYY HH:mm',
  timeFormat: 'H [hours and] m [minutes]'
};
