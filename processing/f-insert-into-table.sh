# Synopsis: Insert each feature as a row into admin_boundaries table

# javascipt code that does the props simplifying
INSERT_INTO_TABLE=./js/insert-into-table.js
# loop over each admin level, simplifying each's props.
for ADMIN in province district commune
do
    node ${INSERT_INTO_TABLE} ${1} ${ADMIN}
done