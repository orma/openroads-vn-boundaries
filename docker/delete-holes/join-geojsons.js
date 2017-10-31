var geojsonStream = require('geojson-stream')
var readFile = require('fs').readFile;
var through2 = require('through2');
var createReadStream = require('fs').createReadStream;
var _ = require('underscore');

/**
 * reads in feature collection, then (in a stream) joins it to a different fc
 * @param {FeatureCollection} fc feature collection we are joining (to another fc)
 * @param {function} cb a callback!
 */
function joiner (fc, cb) {
  readFile(fc, 'utf8', (err, res) => {
    if (err) { throw err }
    cb(null, JSON.parse(res));
  });
}

joiner(process.argv[2], (err, fc) => {
  // create obj w/keys === join field val
  const joinField = process.argv[4];
  // make sure index is a string
  if (typeof fc.features[0].properties[joinField] !== 'string') { 
    fc.features = fc.features.map((f) => { 
      f.properties[joinField] = f.properties[joinField].toString(); 
      return f;
    }); 
  };
  const joiningIndex = _.indexBy(fc.features.map(f => f.properties), joinField);
  // stream read fc to join, joining each match, then adding to features.
  createReadStream(process.argv[3])
  .pipe(geojsonStream.parse())
  .pipe(through2.obj((feature, _, callback) => {
    // see if joiningIndex includes match and if so pipe it through. 
    var toJoinVal = feature.properties[joinField];
    // only join on matches
    if (toJoinVal) {     
      if (typeof toJoinVal !== 'string') { toJoinVal = toJoinVal.toString(); }
      var joinableVal = joiningIndex[toJoinVal];
      feature.properties = Object.assign(feature.properties, joinableVal);
    }
    callback(null, feature)
  }))
  .pipe(geojsonStream.stringify())
  .pipe(process.stdout)
})