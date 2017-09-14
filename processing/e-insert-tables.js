var createReadStream = require('fs').createReadStream;
var createWriteStream = require('fs').createWriteStream;
var readdirSync = require('fs').readdirSync;
var path = require('path');
var parallel = require('async').parallel;

var baseDir = 'data/processing/d-simplify-props'
var knex = require('./db/connection/.js')
var postgis = require('knex-postgis');

// streams to read and write geojsons
var geojsonStream = require('geojson-stream');
var parser = geojsonStream.parse();
var stringifier = geojsonStream.stringify();
// helps split single-line json into chunked-by-line geojson
var split = require('split');
// tmp dir with geojsons
var adminPath = `${baseDir}/tmp`;
var admins = readdirSync(adminPath)

var db = knex({dialect: 'postgres'});
var st = postgis(db);

// create list of async functions to pass to parallel
const adminTasks = admins.map((admin) => {
  return function(cb) {
    var basename = admin.split('-')[1]
    var adminFile = path.join(adminPath, admin)
    var adminFile = path.join('./', admin);
    var adminFileStream = createReadStream(adminFile)
    .pipe(split())
    .pipe(parser)
    .on('data', (feature) => {
      insertIntoTable(feature, basename)
    })
    .on('end', () => { cb(null, null) })
  }
});

function insertIntoTable (feature, admin) {
  const properties = feature.properties;
  const geometry = feature.geometry;
  const statement = db.insert({
    type: admin,
    id: properties.id,
    parent_id: properties.p_id,
    geo: st.geomFromGeoJSON(geometry),
    name_en: properties.en_name,
    name_vn: ''
  }).into(`${admin}-table`).toString();
}

parallel(adminTasks, (err, res) => {
  if (!err) {}
});
