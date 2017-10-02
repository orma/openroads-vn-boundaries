# cd to workspace dir
cd /workspace
INPUT=./vietnam-communes.shp
INPUT_NAME=vietnam-communes

for ADMIN in 'communes;COMCODE02' 'district;DISTCODE02' 'province;PROCODE02'
do
  # split ${ADMIN} string on the semi-colon to grab the admin name and field id
  ADMIN_ARRAY=(${ADMIN//;/ })
  # make the unique output file per the current admin name
  OUTPUT=./vietnam-${ADMIN_ARRAY[0]}.geojson
  # make ${DISSOLVE_FIELD} per the current admin's dissolve field
  DISSOLVE_FIELD=${ADMIN_ARRAY[1]}
  # dissolve on admin field with ogr2ogr and write output as a geojson; also reproject from UTM to wgs84
  # this comman creates a new geojson where features are geometries that share the same ${DISSOLVE_FIELD}
  # 'ST_UNION' merges geometries.
  # 'GROUP BY' tells gdal which gemetries to merge together
  # -t_srs is a flag for reprojection
  # EPSG:4326 is the WGS84 EPSG code
  # http://spatialreference.org/ref/epsg/wgs-84/
  ogr2ogr -t_srs EPSG:4326 -f 'GeoJSON' "${OUTPUT}" "${INPUT}" -dialect sqlite -sql $'SELECT ST_Union(geometry), * FROM "'"$INPUT_NAME"$'" GROUP BY '"$DISSOLVE_FIELD"
done

