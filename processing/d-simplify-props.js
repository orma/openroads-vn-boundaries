var readdirSync = require('fs').readdirSync;
var createReadStream = require('fs').createReadStream;
var createWriteStream = require('fs').createWriteStream;
var path = require('path');
var parallel = require('async').parallel;

// streams to read and write geojsons
var geojsonStream = require('geojson-stream');
var parser = geojsonStream.parse();
var stringifier = geojsonStream.stringify();
// helps split single-line json into chunked-by-line geojson
var split = require('split');
// tmp dir with geojsons
var adminPath = './data/tmp';
var admins = readdirSync(adminPath)
admins = admins.slice(1, admins.length)

// create list of async functions to pass to parallel
const adminTasks = admins.map((admin) => {
  return function(cb) {
    var basename = admin.split('-')[1]
    var adminFile = path.join(adminPath, admin)
    var adminFileStream = createReadStream(adminFile)
    .pipe(split())
    .pipe(parser)
    .on('data', (feature) => {
      const properties = feature.properties;
      feature.properties = makeNewProperties(properties, basename)
    })
    .pipe(stringifier)
    .pipe(createWriteStream(`./data/output/vietnam-${basename}-simplified.geojson`))
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
    newProperties.en_name = EN_name
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

parallel(adminTasks, (err, res) => {
  if (!err) {}
});
