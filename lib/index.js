var _ = require('lodash'),
    gpx = require('./gpx'),
    track = require('./track'),
    check = require('./check'),

    config = require('./config'),
    log = config.log,
    error = config.error;


function checkGpx(opts) {
  log('[File read] ' + opts.filePath);

  updateConfig(opts);
  log('[Max distance] ' + config.maxDistanceTrack + 'm');

  gpx.read(opts.filePath)
  .then(gpx.parse)
  .then(function (gpxJson) {
    var gpxNode = gpxJson.gpx;

    // Do checks
    log(gpx.printInfo(gpxNode));
    doChecks(gpxNode);

    // Delete points
    if (opts.delete) {
      log('Deleting points: ', opts.delete);
      track.deleteTrackPoints(gpxNode, opts.delete);
    }

    // Save file
    if (opts.output) {
      gpx.write(gpxJson, opts.output)
      .then(function () {
        log('File written: ', opts.output);
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

function updateConfig(opts) {
  if (opts.maxDistance) {
    config.maxDistanceTrack = opts.maxDistance;
  }
}


module.exports = checkGpx;
