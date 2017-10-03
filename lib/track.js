var _ = require('lodash'),
    moment = require('moment'),
    gpsDistance = require('gps-distance'),

    config = require('./config'),
    dateFormat = config.dateFormat,
    timeFormat = config.timeFormat;


function getTimes(gpx) {
  var times = [];

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
      times.push(trackTime);
    });
  }

  return times;
}

function printTimes(times) {
  return times.map(function (track, trackIndex) {
    return _.template('Track #<%= index + 1 %>:\n<%= segmentsInfo %>\n')({
      index: trackIndex,
      segmentsInfo: track.map(function (segment, segmentIndex) {
        var start = moment(new Date(segment[0]));
        var end = moment(new Date(segment[1]));
        return _.template('Seg #<%= index + 1 %>: <%= start %> => <%= end %> (<%= duration %>)')({
          index: segmentIndex,
          start: start.format(dateFormat),
          end: end.format(dateFormat),
          // No format for durations so using utc now, think about using
          // https://github.com/jsmreese/moment-duration-format
          duration: moment.utc(end.diff(start)).format(timeFormat)
        });
      }).join('\n')
    });
  }).join('\n');
}

function getClosestTimeToPoint(point, tracks) {
  var currentDistance,
      closestDistance,
      closestTime;

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
    distance: Math.round(closestDistance * 1000)
  };
}

function deleteTrackPoints(gpx, indexArray) {
  var trackPoints = gpx.trk[0].trkseg[0].trkpt;

  indexArray.sort(function(a, b) {
    return a - b;
  }).reverse();
  indexArray.forEach(function (index) {
    trackPoints.splice(index, 1);
  });
}

module.exports = {
  getTimes: getTimes,
  printTimes: printTimes,
  getClosestTimeToPoint: getClosestTimeToPoint,
  deleteTrackPoints: deleteTrackPoints
};
