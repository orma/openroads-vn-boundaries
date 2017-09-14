# enforce right-hand rule for polygons
for ADMIN in district province
do
  INPUT_FILE=${1}/tmp/vietnam-${ADMIN}-wgs84.geojson
  OUTPUT_FILE=${1}/output/vietnam-${ADMIN}-cleaned.geojson
  # remove crs object to match current GeoJSON spec
  sed -i .org '/\"crs\"/ d; /^$/d' ${INPUT_FILE}
  # enforce right to left polygons, also to match current spec
  geojson-rewind ${INPUT_FILE} > ${OUTPUT_FILE}
done
