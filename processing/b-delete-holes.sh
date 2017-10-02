# Synopysis: remoevs holes from dissolved polygons

# take what is in the delete-holes tmp directory and copy it into the the ./processing/docker/delete-holes folder
cp ${1}/tmp/* ./docker/delete-holes
# build delete holes container
docker build -t 'qgis_headless' ./docker/delete-holes
# run the docker contianer, entering at run.sh
docker run -it qgis_headless
# get admin areas from container add copy them over to the output folder of the process
# using the docker cp command, copying from the most recently built container to the output folder
# `docker ps --latest -q` grabs the most recent container
docker cp `docker ps --latest -q`:workspace/vietnam-province-filled-holes.geojson ${1}/output/vietnam-province-filled-holes.geojson
docker cp `docker ps --latest -q`:workspace/vietnam-district-filled-holes.geojson ${1}/output/vietnam-district-filled-holes.geojson
# communes do not need filled holes. so they are just copied directly from the tmp to output folderope 
cp ${1}/tmp/vietnam-communes.geojson ${1}/output/vietnam-communes-filled-holes.geojson
# clean up the docker directory
rm -f ./docker/delete-holes/vietnam*
