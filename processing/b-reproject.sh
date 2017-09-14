for ADMIN in communes district province
do
  # use admin name to generate output and input file names
  INPUT=${1}/tmp/vietnam-${ADMIN}.geojson
  OUTPUT=${1}/output/vietnam-${ADMIN}-wgs84.geojson
  # reproject to wgs84
  ogr2ogr -t_srs EPSG:4326 -f 'GeoJSON' "${OUTPUT}" "${INPUT}"
done
