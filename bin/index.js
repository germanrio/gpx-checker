#! /usr/bin/env node

var yargs = require('yargs'),
    gpsChecker = require('../');

var argv = yargs
    .usage('Check if your gpx track has been recorded properly.\nUsage: gpx-checker <file>')
    .demand(1, 1, 'You should provide a gpx track file.')
    .help('help')
    .alias('h', 'help')
    .argv;

gpsChecker(argv._[0]);
