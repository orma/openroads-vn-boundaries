FROM nuest/qgis-model:xenial-multimodel
COPY ./delete-holes.py /workspace/delete-holes.py
COPY ./main.sh /workspace/main.sh
COPY ./vietnam-district.geojson /workspace/vietnam-district.geojson
COPY ./vietnam-province.geojson /workspace/vietnam-province.geojson
# on entry into container, run the run.sh script
ENTRYPOINT ["/bin/bash", "/workspace/main.sh"]
