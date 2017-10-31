# run qgis process in python while keeping qgis 'headless', or put otherwise access and use qgis processing modules
# without running the qgis gui
cd /workspace
# down node/npm, link them, then setup package w/dependencies for join-geojsons.js
apt-get install -qy nodejs
apt-get install -qy npm
ln -s /usr/bin/nodejs /usr/bin/node
npm init -y
npm install geojson-stream fs through2 underscore
# make geojson with just id and geojson for cleaning. reason for this is the whole deletion seems to be messing with the vietnamese unicode
ogr2ogr -f 'GeoJSON' vietnam-province-id.geojson vietnam-province.geojson -select PROCODE02
ogr2ogr -f 'GeoJSON' vietnam-district-id.geojson vietnam-district.geojson -select DISTCODE02
xvfb-run -a python delete-holes.py vietnam-province-id.geojson vietnam-province-filled
xvfb-run -a python delete-holes.py vietnam-district-id.geojson vietnam-district-filled
node join-geojsons.js vietnam-province.geojson vietnam-province-filled.geojson PROCODE02 > vietnam-province-filled-holes.geojson 
node join-geojsons.js vietnam-district.geojson vietnam-district-filled.geojson PROCODE02 > vietnam-district-filled-holes.geojson

