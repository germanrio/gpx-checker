# Gpx Checker

[![NPM Version][npmImg]][npmUrl]

[npmImg]: https://img.shields.io/npm/v/gpx-checker.svg
[npmUrl]: https://npmjs.org/package/gpx-checker

This command helps you to detect possible errors while recording your gpx tracks.

It checks the following:
1. That all the waypoint times are in the track segments intervals.
2. Distance between two successive track points is not bigger than a max.


## Usage
`gpx-checker <gpxFile>`


## Command Options
**--maxDistance** Allows to set the maximum distance between two successive track points.

**--delete** Allows to remove from the track the points in the indexes specified.
