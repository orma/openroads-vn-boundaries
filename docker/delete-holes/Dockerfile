FROM nuest/qgis-model:xenial-multimodel
RUN apt-get update
COPY ./delete-holes.py /workspace/delete-holes.py
COPY ./join-geojsons.js /workspace/join-geojsons.js
COPY ./main.sh /workspace/main.sh
COPY ./vietnam-district.geojson /workspace/vietnam-district.geojson
COPY ./vietnam-province.geojson /workspace/vietnam-province.geojson
# on entry into container, run the run.sh script
ENTRYPOINT ["/bin/bash", "/workspace/main.sh"]
