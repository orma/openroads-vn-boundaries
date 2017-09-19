# Synopsys: Dockerfile that builds an image that allows headless use of qgis processing module
# uses https://hub.docker.com/r/nuest/qgis-model/~/dockerfile/
# note, the entrypoint of the image is a custom script, hence the forced use of /bin/bash
# entrypoint in docker run cmd

FROM nuest/qgis-model:xenial-multimodel
# copy over python scripts and initial data.
COPY ./clean-geom.py /workspace/clean-geom.py
COPY ./vietnam-communes.cpg /workspace/vietnam-communes.cpg
COPY ./vietnam-communes.dbf /workspace/vietnam-communes.dbf
COPY ./vietnam-communes.prj /workspace/vietnam-communes.prj
COPY ./vietnam-communes.qpj /workspace/vietnam-communes.qpj
COPY ./vietnam-communes.shp /workspace/vietnam-communes.shp
COPY ./vietnam-communes.shx /workspace/vietnam-communes.shx
COPY ./run.sh /workspace/run.sh
# on entry into container, run the run.sh script
ENTRYPOINT ["/bin/bash", "/workspace/main.sh"]
