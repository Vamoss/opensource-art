TIMESTAMP=$(date +%s)

mkdir backup
cd backup
mkdir $TIMESTAMP
cd ..

cp -r public/main/data backup/${TIMESTAMP}/data
