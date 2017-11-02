# cd to workspace dir
cd /workspace

for ADMIN in communes district province
do
  # generate unique input and output files as it has been done in previous examples
  INPUT_FILE=./vietnam-${ADMIN}-filled-holes.geojson
  OUTPUT_FILE=./vietnam-${ADMIN}-cleaned.geojson
  # remove crs object to match current GeoJSON spec using sed.
  # the below command was found in following place
  # https://stackoverflow.com/questions/38028600/how-to-delete-a-json-object-from-json-file-by-sed-command-in-bash (see the mailer example)
  # the `-i .org` allows inplace convserion so the ${INPUT_FILE} effectively has its crs removed.
  # sed -e '/\"crs\"/ d; /^$/d' ${INPUT_FILE} > ${INPUT_FILE} 
  # geojson-rewind winds left-to right wound geojsons right-to-left. the right-to-left output is saved to ${OUTPUT_FILE}
  geojson-rewind ${INPUT_FILE} > ${OUTPUT_FILE}
done

