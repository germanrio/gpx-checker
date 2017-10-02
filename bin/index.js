#! /usr/bin/env node

var yargs = require('yargs'),
    _ = require('lodash'),
    gpsChecker = require('../');

var argv = yargs
    .usage('Check if your gpx track has been recorded properly.\nUsage: gpx-checker <file>')
    .demand(1, 1, 'You should provide a gpx track file.')
    .option('output', {
      alias: 'o',
      describe: 'Output file path to save corrected track',
      type: 'string'
    })
    .option('maxDistance', {
      alias: 'm',
      describe: 'Maximun distance between successive track points in meters',
      type: 'string'
    })
    .option('delete', {
      alias: 'd',
      describe: 'Track point indexes you want to delete from the track. E.g. 48',
      type: 'array'
    })
    .option('deleteRange', {
      alias: 'r',
      describe: 'Range of track point indexes you want to delete from the track. E.g. 56-89',
      type: 'string'
    })
    .help('help')
    .alias('h', 'help')
    .argv;

// Manage delete range or delete points
var deleteArg = argv.delete;
if (argv.deleteRange) {
  var range = argv.deleteRange.split('-');
  deleteArg = _.range(Number(range[0]), Number(range[1]) + 1, 1);
}

gpsChecker({
  filePath: argv._[0],
  output: argv.output,
  maxDistance: parseInt(argv.maxDistance),
  delete: deleteArg
});
