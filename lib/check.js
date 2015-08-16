var _ = require('lodash'),
    moment = require('moment'),
    track = require('./track'),

    config = require('./config'),
    log = config.log,
    dateFormat = config.dateFormat;


function waypoints(gpx, periods) {
  var wptTime;
  if (gpx.wpt) {
    gpx.wpt.forEach(function (waypoint, index) {
      wptTime = waypoint.time[0];
      if (!timeInPeriods(new Date(wptTime), periods)) {
        log('[Error] Waypoint out of time range: #' +
          (index + 1) + ' "' + waypoint.name[0] + '" => ' +
          moment(wptTime).format(dateFormat)
        );

        // Obtain suggested time
        if (gpx.trk) {
          var closestInfo = track.getClosestTimeToPoint(_.pick(waypoint.$, ['lat', 'lon']), gpx.trk);
          log(_.template('[Suggested time] <%= time%> you were at <%= distance%> meters of the waypoint')({
            time: moment(closestInfo.time).format(dateFormat),
            distance: Math.round(closestInfo.distance * 1000)
          }));
        }
      }
    });
  }
}

function timeInPeriods(time, periods) {
  return periods.some(function (period) {
    return ((period[0] <= time) && (time <= period[1]));
  });
}


module.exports = {
  waypoints: waypoints,
  timeInPeriods: timeInPeriods
};
