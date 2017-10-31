# copy input shapefiles from the s3 bucket in which they live
echo --- downloading input boundaries from s3 ---
aws s3 cp s3://openroads-vn-boundaries ${1} --recursive
