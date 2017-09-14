/**
 * @file reads streaming admin geojson and 'inserts' each feature 'into' matching admin postgis table
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
// knex creates a knex obj that links to the current environmnets database
var knex = require('./db/connection/.js')
// postgis is a knex extension to generate postgis statements
var postgis = require('knex-postgis');
// helps split single-line json into chunked-by-line geojson as mentinoed in d-simplify-props.js
var split = require('split');
// directory with geojsons
var adminPath = `data/processing/d-simplify-props/tmp`;
// array including elements with each file in that directory
var admins = readdirSync(adminPath)
// st is short for spatial type. spatial type is the prefix for postgis functions that allow for spatial sql statements
// see https://postgis.net/docs/reference.html
var st = postgis(knex);

// create list of async functions to pass to parallel
const adminTasks = admins.map((admin) => {
  return function(cb) {
    // base name mirrors admin name
    var basename = admin.split('-')[1]
    // here's the path to the current admin file
    var adminFile = path.join(adminPath, admin)
    // stream of this admin file
    var adminFileStream = createReadStream(adminFile)
    // pipe split for the lines needed to send along to the geojson parser
    .pipe(split())
    // the geojson parser for parsing the feature collection
    .pipe(parser)
    .on('data', (feature) => {
      // for each feature, insert it into the table using the insertIntoTable function
      insertIntoTable(feature, basename)
    })
    // fire a callback on end event
    .on('end', () => { cb(null, null) })
  }
});

/**
 * transforms feature into postgis table row and inserts it into the proper admin table
 *
 * @param {object} feature geojson feature
 * @param {string} admin admin name
 */
function insertIntoTable (feature, admin) {
  // generate properties and geometry objects from feature object
  const properties = feature.properties;
  const geometry = feature.geometry;
  const statement = db.insert({
    // shared identifier for each row in admin table
    type: admin,
    // numeric id for current admin unit
    id: properties.id,
    // numeric id for currrent admin unit's parent (for instance a commune's parent district)
    // this is helpful for future spatial analysis
    parent_id: properties.p_id,
    // admin unit geometry
    geo: st.geomFromGeoJSON(geometry),
    // english name of admin unit
    name_en: properties.en_name,
    // vietnamese name of admin unit
    name_vn: ''
  })
  // method that inserts the insert statement into its correct table
  .into(`${admin}-table`).toString();
}

// run tasks in parallel
parallel(adminTasks, (err, res) => {
  // do nothing on result
  if (!err) {}
});
