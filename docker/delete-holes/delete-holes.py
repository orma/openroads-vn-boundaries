# Synopysis: cleans admin geometries using the grass gis v.clean alg available with qgis install
# sys is used primarily for adding qgis utils to path
import sys
import os
# the following qgis modules import and order reference the following
# https://github.com/nuest/docker-qgis-model/blob/master/workspace/example/model.py#L20
from qgis.core import *
import qgis.utils
# to use processing script a qgis app needs to be initialized
app = QgsApplication([], True)
QgsApplication.setPrefixPath('/usr', True)
QgsApplication.initQgis()
# append processing plugin to system path
sys.path.append('/usr/share/qgis/python/plugins')
# import, then initalize the processing pobject
from processing.core.Processing import Processing
Processing.initialize()
import processing
# set path to inputs and outputs
input_communes = os.path.join(os.getcwd(), sys.argv[1])
output_communes = os.path.join(os.getcwd(), sys.argv[2] + '.geojson')
# clean the geometries
processing.runalg('qgis:fillholes',input_communes, 100000, output_communes)
