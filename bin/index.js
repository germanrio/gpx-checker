#! /usr/bin/env node

var yargs = require('yargs'),
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
      describe: 'Track point indexes you want to delete from the track',
      type: 'array'
    })
    .help('help')
    .alias('h', 'help')
    .argv;

gpsChecker({
  filePath: argv._[0],
  output: argv.output,
  maxDistance: parseInt(argv.maxDistance),
  delete: argv.delete
});
