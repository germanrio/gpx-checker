var Promise = require('bluebird');

module.exports = {
  denodeify: Promise.promisify,
  log: console.log,
  error: console.error,
  dateFormat: 'DD/MM/YYYY HH:mm',
  timeFormat: 'H [hours and] m [minutes]'
};
