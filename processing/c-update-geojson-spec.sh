# Synopysis: removes the crs object within geojsons outputed by b-reproject as well as enforces right hand rule for polygon draw orders.
# info about right hand rules and the new GeoJSON spec below
# for right hand, see the winding section here: https://macwright.org/2015/03/23/geojson-second-bite.html
# for the brave, here's the actual spec https://tools.ietf.org/html/rfc7946

# cp files into docker folder
 # copy over admin files to tmp docker folder
cp ${1}/tmp/* ./docker/update-geojson-spec
# build gdal docker container
docker build -t 'update-geojson-spec' ./docker/update-geojson-spec
docker run -it 'update-geojson-spec'
# copy geojsons back over for the new folder
docker cp `docker ps --latest -q`:workspace/vietnam-communes-cleaned.geojson ${1}/output/vietnam-communes-cleaned.geojson
docker cp `docker ps --latest -q`:workspace/vietnam-district-cleaned.geojson ${1}/output/vietnam-district-cleaned.geojson
docker cp `docker ps --latest -q`:workspace/vietnam-province-cleaned.geojson ${1}/output/vietnam-province-cleaned.geojson
# rm files from the docker file
rm -f ./docker/update-geojson-spec/vietnam*