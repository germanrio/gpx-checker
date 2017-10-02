# Gpx Checker

[![NPM Version][npmImg]][npmUrl]

[npmImg]: https://img.shields.io/npm/v/gpx-checker.svg
[npmUrl]: https://npmjs.org/package/gpx-checker

This command helps you to detect possible errors while recording your gpx tracks.

It checks the following:
1. That all the waypoint times are in the track segments intervals.
2. Distance between two successive track points is not bigger than a max.


## Usage
`gpx-checker <gpxFile> [options]`


## Command Options
**--output (-o)** File path to save changes to the gpx. If not set, changes are not saved, like a `dry-run`.

**--maxDistance (-m)** Allows to set the maximum distance between two successive track points.

**--delete (-d)** Allows to remove from the track the points in the indexes specified. You can set this option several times.

**--deleteRange (-r)** Allows to remove from the track the points in the range of indexes specified.


## Examples
- `gpx-checker track.gpx -m 25`
- `gpx-checker track.gpx -d 56 -d 74 -d 25 -o corrected_track.gpx`
- `gpx-checker track.gpx -r 36-57 -o corrected_track.gpx`
