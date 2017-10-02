# Synopsys: Dockerfile that builds an image that includes gdal 
# uses https://github.com/geo-data/gdal-docker

FROM node:6.11-slim
# istall geojson rewind
RUN npm install -g geojson-rewind
RUN mkdir -p /workspace/
COPY ./main.sh /workspace/main.sh
COPY ./vietnam-communes-filled-holes.geojson /workspace/vietnam-communes-filled-holes.geojson
COPY ./vietnam-district-filled-holes.geojson /workspace/vietnam-district-filled-holes.geojson
COPY ./vietnam-province-filled-holes.geojson /workspace/vietnam-province-filled-holes.geojson
ENTRYPOINT ["bin/bash", "/workspace/main.sh"] 
