# copy input geojsons into temp folder
cp ./data/input/* ./data/tmp


for ADMIN in district province
do
  # use admin name to generate output and input file names
  INPUT=./data/tmp/vietnam-${ADMIN}.geojson
  OUTPUT=./data/output/vietnam-${ADMIN}-wgs84.geojson
  # reproject to wgs84
  ogr2ogr -t_srs EPSG:4326 -f 'GeoJSON' "${OUTPUT}" "${INPUT}"
done
