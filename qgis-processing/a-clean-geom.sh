# Synopysis: cleans commune admin geometries so that dissolving in step b works properly

# take contents of tmp directory add add it to the docker directory
cp ${1}/tmp/* ./docker/delete-holes
# build clean-geom container
docker build -t 'qgis_headless' ./docker/clean-geometries
# run the docker contianer, entering at run.sh
docker run -it qgis_headless
# get admin areas from container add copy them over to the output folder of the process
# using the docker cp command, copying from the most recently built container to the output folder
# `docker ps --latest -q` grabs the most recent container
docker cp `docker ps --latest -q`:workspace/vietnam-communes-cleaned.geojson ${1}/output/vietnam-communes-cleaned.geojson
docker cp `docker ps --latest -q`:workspace/vietnam-districts-cleaned.geojson ${1}/output/vietnam-districts-cleaned.geojson
docker cp `docker ps --latest -q`:workspace/vietnam-province-cleaned.geojson ${1}/output/vietnam-province-cleaned.geojson
# clean up the docker directory
rm -f ./docker/clean-geometries/vietnam*
