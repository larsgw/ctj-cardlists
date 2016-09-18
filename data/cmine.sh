#!/bin/bash

OPTIND=1

QUERY=""
LIMIT=0
CODE=""

while getopts "q:l:c:" opt; do
  case "$opt" in
  q)
    QUERY=$OPTARG
    ;;
  l)
    LIMIT=$OPTARG
    ;;
  c)
    CODE=$OPTARG
    ;;
  esac
done

shift $((OPTIND-1))

[ "$1" = "--" ] && shift

if [ -z "$QUERY" ] || [ -z "$LIMIT" ] || [ -z "$CODE" ]; then
  echo "Please provide arguments -q (query), -l (article limit) and -c (project code)"
  exit 1
fi

echo "Making output directory $CODE"
cd "${0%/*}"
mkdir $CODE

echo "Running getpapers with query $QUERY and limit $LIMIT:"
getpapers -q $QUERY -k $LIMIT -o $CODE/data -x

echo "Running ContentMine pipeline:"
norma --project $CODE/data -i fulltext.xml -o scholarly.html --transform nlm2html
ami2-species --project $CODE/data -i scholarly.html --sp.species --sp.type genus
ami2-species --project $CODE/data -i scholarly.html --sp.species --sp.type binomial
ami2-word --project $CODE/data --w.words wordFrequencies --w.stopwords stopwords.txt 
ami2-sequence --project $CODE/data --filter file\(\*\*/results.xml\) -o sequencesfiles.xml

echo "Converting to JSON:"
node ../js/ctj.js -p ../data/$CODE/data -o ../data/$CODE/data -c genus,binomial
node ../js/card.js -p ../data/$CODE/data
node ../js/card-words.js -p ../data/$CODE/data

echo "Removing unnecessary files:"
rm -rf $CODE/data/