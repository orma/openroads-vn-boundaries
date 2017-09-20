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
// var knex = require('./db/connection/.js')
var db = require('../db/connection');
// postgis is a knex extension to generate postgis statements
var postgis = require('knex-postgis');
// helps split single-line json into chunked-by-line geojson as mentinoed in d-simplify-props.js
var split = require('split');
// directory with geojsons
var baseDir = process.argv[2];
var adminInPath = `${baseDir}/tmp`
// array including elements with each file in that directory
// st is short for spatial type. spatial type is the prefix for postgis functions that allow for spatial sql statements
// see https://postgis.net/docs/reference.html
var st = postgis(db);

// return current admin
var admin = readdirSync(adminInPath).find((admin) => new RegExp(process.argv[3]).test(admin));
// base name mirrors admin name
var basename = admin.split('-')[1]
// here's the path to the current admin file
var adminFile = path.join(adminInPath, admin)
// stream of this admin file
var adminFileStream = createReadStream(adminFile)
// pipe split for the lines needed to send along to the geojson parser
.pipe(split())
// the geojson parser for parsing the feature collection
.pipe(parser)
.on('data', (feature) => {
// for each feature, insert it into the table using the insertIntoTable function
  if (feature.properties) {
    insertIntoTable(feature, basename, st, db)
  }
})
.on('end', () => {
  db.destroy();
})

/**
 * transforms feature into postgis table row and inserts it into the proper admin table
 *
 * @param {object} feature geojson feature
 * @param {string} admin admin name
 * @param {object} st spatial type object (generated by knex postgis extension) that allows for making st/postgis statements
 * @param {object} db kenx object for connecting to the database
 *
 */
function insertIntoTable (feature, admin, st, db) {
  // generate properties and geometry objects from feature object
  const properties = feature.properties;
  const geometry = feature.geometry;
  if (admin === 'communes') {
    admin = 'commune';
  }
  if (!properties.en_name) {
    properties.en_name = '...'
  }
  var t;
  return db.transaction((t) => {
    return db('admin_boundaries')
    .transacting(t)
    .insert({
      // shared identifier for each row in admin table
      type: admin,
      // numeric id for current admin unit
      id: properties.id,
      // numeric id for currrent admin unit's parent (for instance a commune's parent district)
      // this is helpful for future spatial analysis
      parent_id: properties.p_id,
      // admin unit geometry
      geom: st.geomFromGeoJSON(geometry),
      // english name of admin unit
      name_en: properties.en_name,
      // vietnamese name of admin unit
      name_vn: ''
    })
    .then(t.commit)
    .catch((e) => {
      t.rollback();
      throw e;
    })
  })
  .then(r => {})
  .catch((e) => {
    throw e;vim
  })
}
