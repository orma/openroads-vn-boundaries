# run qgis process in python while keeping qgis 'headless', or put otherwise access and use qgis processing modules
# without running the qgis gui
cd /workspace
# remove holes for all three admin files
xvfb-run -e ${XVFB_LOGFILE} python delete-holes.py vietnam-province.geojson vietnam-province-filled-holes
xvfb-run -e ${XVFB_LOGFILE} python delete-holes.py vietnam-communes.geojson vietnam-communes-filled-holes
xvfb-run -e ${XVFB_LOGFILE} python delete-holes.py vietnam-district.geojson vietnam-district-filled-holes
