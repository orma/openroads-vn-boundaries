/**
 * @file reads streaming admin geojson and reduces properties to match the schema of the table to which it is going to be written
 */

// these modules are needed for streaming geojsons
var createReadStream = require('fs').createReadStream;
var createWriteStream = require('fs').createWriteStream;
var readdirSync = require('fs').readdirSync;
var geojsonStream = require('geojson-stream');
var parser = geojsonStream.parse();
var stringifier = geojsonStream.stringify();
// module to read path
var path = require('path');
// parallel allows for reading each admin geojson stream asynchronously
var parallel = require('async').parallel;
// since the output of `c-update-geojson-spec.sh` writes geojsons to a single line, the stream needs to be broken up into lines, otherwise it will not work
// split is a module that does just this.
var split = require('split');

// directory with geojson files
var adminPath = 'data/processing/d-simplify-props/tmp'
// read in files as a list usable in the parallel function
var admins = readdirSync(adminPath)

// create that list of async functions to pass to parallel
const adminTasks = admins.map((admin) => {
  return function(cb) {
    // the basename, really the admin level name, of the current admin
    var basename = admin.split('-')[1]
    // the relative path to the current admin file
    var adminFile = path.join(adminPath, admin)
    // a read stream of admin file
    var adminFileStream = createReadStream(adminFile)
    // piping split makes the new lines mentioned to be neccessary above
    .pipe(split())
    // parser is a transform stream that parses geojson feature collections (the form of the input geojson)
    .pipe(parser)
    .on('data', (feature) => {
      // make and pass feature's properties to the make makeNewProperties function that correctly transforms
      // the properties to uniform spec needed to insert into the postgis tables
      const properties = feature.properties;
      // reset the feature properties as the returj from makeNewProperties
      feature.properties = makeNewProperties(properties, basename)
    })
    // stringify the geojson to send to createWriteStream, then write it to fiel
    .pipe(stringifier)
    .pipe(createWriteStream(`${baseDir}/output/vietnam-${basename}-simplified.geojson`))
    // when createWriteStream is closed, fire a callback.
    .on('close', () => { cb(null, null) })
  }
});

/**
 * simplifies input properties to spec needed to make admin postgis tables
 *
 * @param {object} properties original properties from streaming geojson
 * @param {string} admin admin unit name, like 'commune', 'district,'
 * @return {object} newProperties simplified properties generated from properties
 */
function makeNewProperties (properties, admin) {
  const newProperties = {};
  if (RegExp(/commune/).test(admin)) {
    newProperties.en_name = properties.EN_name
    newProperties.id = properties.COMCODE02;
    newProperties.p_id = properties.DISTCODE02
  } else if (RegExp(/district/).test(admin)) {
    newProperties.en_name = properties.D_EName
    newProperties.id = properties.DISTCODE02
    newProperties.p_id = properties.PROCODE02
  } else {
    newProperties.en_name = properties.P_EName
    newProperties.id = properties.PROCODE02
  }
  return newProperties;
}

// run adminTasks in parallel
parallel(adminTasks, (err, res) => {
  // do nothing when the are all finished
  if (!err) {}
});
