var fs = require('fs'),
    _ = require('lodash'),
    xml2js = require('xml2js'),
    moment = require('moment'),
    dateFormat = 'DD/MM/YYYY HH:mm',
    timeFormat = 'H [hours and] m [minutes]',
    gpsDistance = require('gps-distance');

function checkGpx(file) {
  fs.readFile(file, {encoding: 'utf8'}, function (err, data) {
    if (err) {
      console.error('[Error] File not found > ' + file);
      return;
    }

    console.log('[File read] ' + file);
    parseGpx(data);
  });
}

function parseGpx(data) {
  xml2js.parseString(data, function (err, gpxJson) {
    if (err) {
      console.error('[Error] Parsing GPX file');
      return;
    }

    var gpx = gpxJson.gpx,
        trackTimes = getTrackTimes(gpx),
        periods = _.flatten(trackTimes);
    printGpxInfo(gpx);
    printTrackTimes(trackTimes);

    checkWaypoints(gpx, periods);

  });
}

function checkWaypoints(gpx, periods) {
  var wptTime;
  if (gpx.wpt) {
    gpx.wpt.forEach(function (waypoint, index) {
      wptTime = waypoint.time[0];
      if (!checkTimeInPeriods(new Date(wptTime), periods)) {
        console.error('[Error] Waypoint out of time range: #' +
          (index + 1) + ' "' + waypoint.name[0] + '" => ' +
          moment(wptTime).format(dateFormat)
        );

        // Obtain suggested time
        if (gpx.trk) {
          var closestInfo = getClosestTimeToPoint(_.pick(waypoint.$, ['lat', 'lon']), gpx.trk);
          console.log(_.template('[Suggested time] <%= time%> you were at <%= distance%> meters of the waypoint')({
            time: moment(closestInfo.time).format(dateFormat),
            distance: Math.round(closestInfo.distance * 1000)
          }));
        }
      }
    });
  }
}

function printGpxInfo(gpx) {
  var template = _.template(
        '[GPX Version] <%= version %>\n' +
        '[GPX Creator] <%= creator %>\n' +
        '\n' +
        '[Track name] <%= metadata.name[0] %>\n' +
        '<% if(metadata.desc[0]) { %>[Track desc] <%= metadata.desc[0] %>\n<% } %>' +
        '[Track time] <%= metadata.time[0] %>\n'
      );

  console.log(template({
    version: gpx.$.version,
    creator: gpx.$.creator,
    metadata: gpx.metadata[0]
  }));
}

function getTrackTimes(gpx) {
  var trackTimes = [];

  if (gpx.trk) {
    gpx.trk.forEach(function (track) {
      var trackTime = [];
      if (track.trkseg) {
        track.trkseg.forEach(function (segment) {
          var points = segment.trkpt,
              length = points.length,
              start = new Date(points[0].time[0]),
              end = new Date(points[length - 1].time[0]);
          trackTime.push([start, end]);
        });
      }
      trackTimes.push(trackTime);
    });
  }

  return trackTimes;
}

function printTrackTimes(trackTimes) {
  var timesText = trackTimes.map(function (track, trackIndex) {
    return _.template('Track #<%= index + 1 %>:\n<%= segmentsInfo %>\n')({
      index: trackIndex,
      segmentsInfo: track.map(function (segment, segmentIndex) {
        return _.template('Seg #<%= index + 1 %>: <%= start %> => <%= end %> (<%= duration %>)')({
          index: segmentIndex,
          start: moment(segment[0]).format(dateFormat),
          end: moment(segment[1]).format(dateFormat),
          duration: moment(segment[1]).subtract(moment(segment[0])).format(timeFormat)
        });
      }).join('\n')
    });
  }).join('\n');

  console.log(timesText);
}

function checkTimeInPeriods(time, periods) {
  return periods.some(function (period) {
    return ((period[0] <= time) && (time <= period[1]));
  });
}

function getClosestTimeToPoint(point, tracks) {
  var currentDistance, closestDistance, closestTime;

  tracks.forEach(function (track) {
    track.trkseg.forEach(function (segment) {
      segment.trkpt.forEach(function (pt) {
        currentDistance = gpsDistance(
          parseFloat(point.lat),
          parseFloat(point.lon),
          parseFloat(pt.$.lat),
          parseFloat(pt.$.lon)
        );
        if (_.isUndefined(closestDistance) || (currentDistance < closestDistance)) {
          closestDistance = currentDistance;
          closestTime = pt.time[0];
        }
      });
    });
  });

  return {
    time: new Date(closestTime),
    distance: closestDistance
  };
}

module.exports = checkGpx;
