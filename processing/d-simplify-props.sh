# Synopsys: reduces geojson properties to a uniform spec used to insert data into postgis tables

# javascipt code that does the props simplifying
SIMPLIFY_PROPS=./js/simplify-props.js
# loop over each admin level, simplifying each's props.
for ADMIN in province district commune
do
    node ${SIMPLIFY_PROPS} ${1} ${ADMIN}
done