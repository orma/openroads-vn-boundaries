# Synopsys: Dockerfile that builds an image that includes gdal 
# uses https://github.com/geo-data/gdal-docker

FROM geodata/gdal
# make a workspace directory
RUN mkdir -p /workspace/
# copy over python scripts and initial data.
COPY ./vietnam-communes.cpg /workspace/vietnam-communes.cpg
COPY ./vietnam-communes.dbf /workspace/vietnam-communes.dbf
COPY ./vietnam-communes.prj /workspace/vietnam-communes.prj
COPY ./vietnam-communes.qpj /workspace/vietnam-communes.qpj
COPY ./vietnam-communes.shp /workspace/vietnam-communes.shp
COPY ./vietnam-communes.shx /workspace/vietnam-communes.shx
COPY ./main.sh /workspace/main.sh
# on entry into container, run the main.sh script
ENTRYPOINT ["/bin/bash", "/workspace/main.sh"]
