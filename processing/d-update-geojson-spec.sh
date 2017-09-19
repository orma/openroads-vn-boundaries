# Synopysis: removes the crs object within geojsons outputed by b-reproject as well as enforces right hand rule for polygon draw orders.
# info about right hand rules and the new GeoJSON spec below
# for right hand, see the winding section here: https://macwright.org/2015/03/23/geojson-second-bite.html
# for the brave, here's the actual spec https://tools.ietf.org/html/rfc7946

for ADMIN in communes district province
do
  # generate unique input and output files as it has been done in previous examples
  INPUT_FILE=${1}/tmp/vietnam-${ADMIN}-filled-holes.geojson
  OUTPUT_FILE=${1}/output/vietnam-${ADMIN}-cleaned.geojson
  # remove crs object to match current GeoJSON spec using sed.
  # the below command was found in following place
  # https://stackoverflow.com/questions/38028600/how-to-delete-a-json-object-from-json-file-by-sed-command-in-bash (see the mailer example)
  # the `-i .org` allows inplace convserion so the ${INPUT_FILE} effectively has its crs removed.
  sed -i .org '/\"crs\"/ d; /^$/d' ${INPUT_FILE}
  # geojson-rewind winds left-to right wound geojsons right-to-left. the right-to-left output is saved to ${OUTPUT_FILE}
  geojson-rewind ${INPUT_FILE} > ${OUTPUT_FILE}
done
