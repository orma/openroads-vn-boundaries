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
// since the output of `c-update-geojson-spec.sh` writes geojsons to a single line, the stream needs to be broken up into lines, otherwise it will not work
// split is a module that does just this.
var split = require('split');
// directory for geojson input and output
var baseDir = process.argv[2];
var adminInPath = `${baseDir}/tmp`;
var adminOutPath = `${baseDir}/output`
// read in files as a list usable in the parallel function
var admin = readdirSync(adminInPath).find((admin) => new RegExp(process.argv[3]).test(admin));
writeSimplifiedProps(admin);

/**
 * simplifies input properties to spec needed to make admin postgis tables
 * @func makeNewProperties
 * @param {object} properties original properties from streaming geojson
 * @param {string} admin admin unit name, like 'commune', 'district,'
 * @return {object} newProperties simplified properties generated from properties
 */
function makeNewProperties (properties, admin) {
  const newProperties = {};
  if (new RegExp(/commune/).test(admin)) {
    newProperties.en_name = properties.EN_name
    newProperties.vn_name = properties.COMNAME
    newProperties.id = properties.COMCODE02;
    newProperties.p_id = properties.DISTCODE02
  } else if (new RegExp(/district/).test(admin)) {
    newProperties.en_name = properties.D_EName
    newProperties.vn_name = properties.DISTNAME
    newProperties.id = properties.DISTCODE02
    newProperties.p_id = properties.PROCODE02
  } else if (new RegExp(/province/).test(admin)) {
    newProperties.en_name = properties.P_EName
    newProperties.vn_name = properties.PRONAME
    newProperties.id = properties.PROCODE02
  }
  newProperties.en_name = cleanName(newProperties.en_name, admin);
  newProperties.vn_name = cleanName(newProperties.vn_name, admin);
  return newProperties;
}

/**
 * reads in raw geojson and writes out simplified geojson for provided admin level
 * @func writeSimplifiedProps
 * @param {string} admin string representation of admin type
 *
 */
function writeSimplifiedProps(adminPath) {
  // the basename, really the admin level name, of the current admin
  var basename = admin.split('-')[1];
  // the relative path to the current admin file
  var adminInFile = path.join(adminInPath, admin)
  // a read stream of admin file
  createReadStream(adminInFile)
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
  .pipe(createWriteStream(`${adminOutPath}/vietnam-${basename}-simplified.geojson`)) 
}

/**
 * returns cleaned version of place name
 * @func cleanName
 * @param {string} name admin unit name
 * @return {string} cleaned admin unit name
 */
function cleanName(name, admin) {
  let cleanName;
  if (name) {
    if (new RegExp(/X. /).test(name)) {
      cleanName = name.replace('X. ','');
    } else if (new RegExp(/P. /).test(name)) {
      cleanName = name.replace('P. ', '')
    } else if (new RegExp(/Tt. /).test(name)) {
      cleanName = name.replace('Tt. ', '') 
    } else if (new RegExp(/TP./).test(name)) {
      cleanName = name.replace(/TP./, '')
    } else if (new RegExp(/P. /).test(name)) {
      cleanName = name.replace('P. ', '')
    } else if (new RegExp(/ D./).test(name)){
      cleanName = name.replace(' D.', '')
    } else if (new RegExp(/\\?/).test(name)) {
      cleanName = name.replace('?', 'ỉ')   
    }
    if (Boolean(Number(cleanName))) {
      cleanName = `${admin} ${cleanName}`
    }
    cleanName.trim()
  } else { cleanName = ''}
  // make it titlecase
  return cleanName;
}
