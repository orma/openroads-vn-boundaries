# Synopysis: links a set of I/O geoprocessing scripts that transform a commune level shapefile of Vietnam admin areas
###########  into three postgis tables at commune, district, and province levels/

# output directory that holds the final output of linked processes
OUT_DIR=./data/output
# the base processing directory that includes sub directories that I/O data for each process
PROCESSING_BASE_DIR=./data/processing
# a special directory used to handoff data between each process
HNDF_DIR=./data/handoff

# delete handoff or process directories from previous runs that may have errored.
rm -rf ${HNDF_DIR}
rm -rf ${PROCESSING_BASE_DIR}

# make handoff and process directories for current pipeline run
mkdir ${PROCESSING_BASE_DIR}
mkdir ${HNDF_DIR}

# make directories in ${PROCESSING_BASE_DIR} for each process's I/O these process scripts live in ./processing
for FILE in ./processing/*
do
  # make process file availabe
  chmod +x ${FILE}
  # get base filename from its path to generate the process's ${PROCESS_DIR} IN ${PROCESS_BASE_DIR}
  FILEBASE=${FILE##*/}
  FILESPLIT=(${FILEBASE//./ })
  FILENAME=${FILESPLIT[0]}
  PROCESS_DIR=${PROCESSING_BASE_DIR}/${FILENAME}
  # make process dir
  mkdir ${PROCESS_DIR}
  # IN ${PROCESS_DIR} generate the input, tmp, and output ${PROCESS_SUBDIR}s needed to handle process specific I/O
  for SUBDIR in input tmp output
  do
    PROCESS_SUBDIR=${PROCESS_DIR}/${SUBDIR}
    mkdir ${PROCESS_SUBDIR}
    # if the current ${PROCESS_SUBDIR} is input, and the process is the first dissolve process, copy the pipeline's only input, the commune shapefile, into it
    if [[ $SUBDIR == *"input"* ]]
    then
      if [[ $PROCESS_SUBDIR == *"dissolve"* ]]
      then
        cp -R ./data/input/. ${PROCESS_SUBDIR}/
      fi
    fi
  done
  # for all processes except the first dissolve process, first copy the data inside the ${HNDF_DIR} into the process's input dir, then delete that process's content from handoff
  # the reason for removal is to make sure only proper files exist there as some process scripts read in all of input and not files of a specific nomenclature
  if [[ $PROCESS_SUBDIR != *"dissolve"* ]]
  then
    cp -R ${HNDF_DIR}/. ${PROCESS_DIR}/input/
    rm -f  ${HNDF_DIR}/*
  fi
  # move input data to process's tmp dir so that any pipeline process errors allow for original input to be inspected.
  cp -R ${PROCESS_DIR}/input/. ${PROCESS_DIR}/tmp/
  # run process with command specific to if it is a shell process or javascript process
  echo --- running ${FILENAME} ---
  if [[ $FILE == *".sh"* ]]
  then
    ${FILE} ${PROCESS_DIR}
  else
    node ${FILE} ${PROCESS_DIR}
  fi
  # copy output contents to handoff directory for the next process to grab
  cp -R ${PROCESS_DIR}/output/. ${HNDF_DIR}/
done
# clean up
rm -rf ${HNDF_DIR}
rm -rf ${PROCESSING_BASE_DIR}
