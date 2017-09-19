# cd to workspace dir
cd /workspace
# run qgis process in python while keeping qgis 'headless', or put otherwise access and use qgis processing modules
# without running the qgis gui
# clean the geometry for the initial communes file
xvfb-run -a python clean-geom.py vietnam-communes.shp vietnam-communes-clean-geom
