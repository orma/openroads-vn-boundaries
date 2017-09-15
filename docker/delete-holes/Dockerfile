FROM nuest/qgis-model:xenial-multimodel
COPY ./delete-holes.py /workspace/delete-holes.py
COPY ./run.sh /workspace/run.sh
COPY ./vietnam-communes.geojson /workspace/vietnam-communes.geojson
COPY ./vietnam-district.geojson /workspace/vietnam-district.geojson
COPY ./vietnam-province.geojson /workspace/vietnam-province.geojson
# on entry into container, run the run.sh script
ENTRYPOINT ["/bin/bash", "/workspace/run.sh"]
