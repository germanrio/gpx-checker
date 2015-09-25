var _ = require('lodash'),
    moment = require('moment'),
    gpsDistance = require('gps-distance'),
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
        log(_.template('[Error] Waypoint out of time range: #<%= index%> "<%= name%>" => <%= time%>')({
          index: index + 1,
          name: waypoint.name[0],
          time: moment(wptTime).format(dateFormat)
        }));

        // Obtain suggested time
        if (gpx.trk) {
          var closestInfo = track.getClosestTimeToPoint(_.pick(waypoint.$, ['lat', 'lon']), gpx.trk);
          waypoint.time[0] = moment(closestInfo.time).utc().format(config.isoDateFormat);
          log(_.template('[Suggested time] <%= time%> you were at <%= distance%> meters of the waypoint')({
            time: moment(closestInfo.time).format(dateFormat),
            distance: closestInfo.distance
          }));
        }
      }
    });
  }
}

function trackDistance(gpx) {
  var lastPoint,
      distance;

  if (gpx.trk) {
    gpx.trk.forEach(function (track) {
      if (track.trkseg) {
        track.trkseg.forEach(function (segment) {
          lastPoint = null;
          segment.trkpt.forEach(function (point, index) {
            if (!lastPoint) {
              lastPoint = point;
              return;
            }

            // Calculate distance between points
            distance = Math.round(gpsDistance(
              parseFloat(lastPoint.$.lat),
              parseFloat(lastPoint.$.lon),
              parseFloat(point.$.lat),
              parseFloat(point.$.lon)
            ) * 1000);

            // Compare distance between points
            if (distance > config.maxDistanceTrack) {
              log(_.template('[Error] Track points too far: #<%= index%> at <%= time%> => <%= distance%> meters')({
                index: index + 1,
                time: moment(point.time[0]).format(dateFormat),
                distance: distance
              }));
            }

            lastPoint = point;
          });
        });
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
  trackDistance: trackDistance,
  timeInPeriods: timeInPeriods
};
