var _ = require('lodash'),
    gpx = require('./gpx'),
    track = require('./track'),
    check = require('./check'),

    config = require('./config'),
    log = config.log,
    error = config.error;


function checkGpx(opts) {
  log('[File read] ' + opts.filePath);

  gpx.read(opts.filePath)
  .then(gpx.parse)
  .then(function (gpxJson) {
    var gpxNode = gpxJson.gpx;

    log(gpx.printInfo(gpxNode));
    doChecks(gpxNode);

    if (opts.output) {
      gpx.write(gpxJson, opts.output)
      .then(function () {
        console.log('File written.');
      });
    }
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
  check.trackDistance(gpx);
}


module.exports = checkGpx;
