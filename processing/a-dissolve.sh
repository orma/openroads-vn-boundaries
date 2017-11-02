# Synopysis: creates district and province level admins by dissolving (merging geometrise) of features with same uniq id.

# copy over admin files to tmp docker folder
cp ${1}/tmp/* ./docker/dissolve
# build gdal docker container
docker build -t 'gdal' ./docker/dissolve
# run the gdal container
docker run -it gdal

# cp over each admin to the admin data folder. 
docker cp `docker ps --latest -q`:workspace/vietnam-communes.geojson ${1}/output/vietnam-communes.geojson
docker cp `docker ps --latest -q`:workspace/vietnam-district.geojson ${1}/output/vietnam-district.geojson
docker cp `docker ps --latest -q`:workspace/vietnam-province.geojson ${1}/output/vietnam-province.geojson

# remove shapefiles from docer folder
rm -f ./docker/dissolve/vietnam*