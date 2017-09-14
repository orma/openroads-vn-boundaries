# needed directories #
OUT_DIR=./data/output
PROCESSING_BASE_DIR=./data/processing
HNDF_DIR=./data/handoff

# clean up early
rm -rf ${HNDF_DIR}
rm -rf ${PROCESSING_BASE_DIR}
# make processing directory for each process
mkdir ${PROCESSING_BASE_DIR}
# make handof dir between processes
mkdir ${HNDF_DIR}
# make directories in processing for each process's I/O
for FILE in ./processing/*
do
  chmod +x ${FILE}
  # get base filename from its path
  FILEBASE=${FILE##*/}
  FILESPLIT=(${FILEBASE//./ })
  FILENAME=${FILESPLIT[0]}
  PROCESS_DIR=${PROCESSING_BASE_DIR}/${FILENAME}
  # make process dir
  mkdir ${PROCESS_DIR}
  # make matching directories in data
  for SUBDIR in input tmp output
  do
    PROCESS_SUBDIR=${PROCESS_DIR}/${SUBDIR}
    mkdir ${PROCESS_SUBDIR}
    # cp commune shapefile into dissolve subdir's input dir
    if [[ $SUBDIR == *"input"* ]]
    then
      if [[ $PROCESS_SUBDIR == *"dissolve"* ]]
      then
        cp ./data/input/* ${PROCESS_SUBDIR}
      fi
    fi
  done
  # cp handoff dir contents to process tmp dir, for all expect first process
  if [[ $PROCESS_SUBDIR != *"dissolve"* ]]
  then
    # copy contents of handoff dir to process' input
    cp ${HNDF_DIR}/* ${PROCESS_DIR}/input
    # remove contents of handoff directory
    rm -f  ${HNDF_DIR}/*
  fi
  # move input data to process's tmp dir.
  # this ensures if err occurs during gdal processes, a copy of I exists
  cp ${PROCESS_DIR}/input/* ${PROCESS_DIR}/tmp
  # run process
  echo --- running ${FILENAME} ---
  ${FILE} ${PROCESS_DIR}
  # copy output contents to handoff directory
  cp ${PROCESS_DIR}/output/* ${HNDF_DIR}
  if [[ ${FILENAME} == *"insert-admin"* ]]
  then
    cp ${PROCESS_DIR}/output/* ${OUT_DIR}
  fi

done
# clean up
rm -rf ${HNDF_DIR}
rm -rf ${PROCESSING_BASE_DIR}
