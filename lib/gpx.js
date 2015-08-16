var fs = require('fs'),
    _ = require('lodash'),
    xml2js = require('xml2js'),

    config = require('./config'),
    denodeify = config.denodeify;


function read(file) {
  return denodeify(fs.readFile)(file, {encoding: 'utf8'})
  .catch(function (e) {
    throw new Error('File not found > ' + e.message);
  });
}

function parse(data) {
  return denodeify(xml2js.parseString)(data)
  .catch(function (e) {
    throw new Error('Parsing GPX file > ' + e.message);
  });
}

function printInfo(gpx) {
  var template = _.template(
        '[GPX Version] <%= version %>\n' +
        '[GPX Creator] <%= creator %>\n' +
        '\n' +
        '[Track name] <%= metadata.name[0] %>\n' +
        '<% if(metadata.desc[0]) { %>[Track desc] <%= metadata.desc[0] %>\n<% } %>' +
        '[Track time] <%= metadata.time[0] %>\n'
      );

  return template({
    version: gpx.$.version,
    creator: gpx.$.creator,
    metadata: gpx.metadata[0]
  });
}


module.exports = {
  read: read,
  parse: parse,
  printInfo: printInfo
};
