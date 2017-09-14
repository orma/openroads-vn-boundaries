# Synopysis: reproject each admin geojson from UTM to WGS84
for ADMIN in communes district province
do
  # generate the input name for the current ${ADMIN} file
  INPUT=${1}/tmp/vietnam-${ADMIN}.geojson
  # generate the output name for the current ${ADMIN} file
  OUTPUT=${1}/output/vietnam-${ADMIN}-wgs84.geojson
  # reproject ${INPUT} to wgs84 with ogr2ogr
  # -t_srs is a flag for reprojection
  # EPSG:4326 is the WGS84 EPSG code
  # http://spatialreference.org/ref/epsg/wgs-84/
  ogr2ogr -t_srs EPSG:4326 -f 'GeoJSON' "${OUTPUT}" "${INPUT}"
done
