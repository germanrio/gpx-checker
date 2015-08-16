var _ = require('lodash'),
    gpx = require('./gpx'),
    track = require('./track'),
    check = require('./check'),

    config = require('./config'),
    log = config.log,
    error = config.error;


function checkGpx(opts) {
  log('[File read] ' + opts.file);

  gpx.read(opts.file)
  .then(gpx.parse)
  .then(function (gpxJson) {
    var gpxNode = gpxJson.gpx;

    log(gpx.printInfo(gpxNode));
    doChecks(gpxNode);
  })
  .catch(function (e) {
    error(e);
  });
}

function doChecks(gpx) {
  var trackTimes = track.getTimes(gpx),
      periods = _.flatten(trackTimes);

  log(track.printTimes(trackTimes));
  check.waypoints(gpx, periods);
}


module.exports = checkGpx;
