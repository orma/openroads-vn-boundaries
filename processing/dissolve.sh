# input, output files
INPUT=./data/tmp/vietnam-communes.shp
INPUT_NAME=vietnam-communes

# copy input shapefile into tmp directory
cp ./data/input/* ./data/tmp

# for districts and provinces + their uniq field
for ADMIN in 'district;DISTCODE02' 'province;PROCODE02'
do
  # split ADMIN into array including admin name and its field
  ADMIN_ARRAY=(${ADMIN//;/ })
  # use admin name to generate output file name
  OUTPUT=./data/output/vietnam-${ADMIN_ARRAY[0]}.geojson
  # set DISSOLVE_FIELD to admin field
  DISSOLVE_FIELD=${ADMIN_ARRAY[1]}
  # dissolve on admin field and write to file
  ogr2ogr -f 'GeoJSON' "${OUTPUT}" "${INPUT}" -dialect sqlite -sql $'SELECT ST_Union(geometry), * FROM "'"$INPUT_NAME"$'" GROUP BY '"$DISSOLVE_FIELD"
done
