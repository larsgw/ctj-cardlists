#!/bin/bash

OPTIND=1

QUERY=""
LIMIT=0
CODE=""
COLUMNS="c,b"

while getopts "q:l:p:c:" opt; do
  case "$opt" in
  q)
    QUERY=$OPTARG
    ;;
  l)
    LIMIT=$OPTARG
    ;;
  p)
    CODE=$OPTARG
    ;;
  c)
    COLUMNS=$OPTARG
    ;;
  esac
done

shift $((OPTIND-1))

[ "$1" = "--" ] && shift

if [ -z "$QUERY" ] || [ -z "$LIMIT" ] || [ -z "$CODE" ]; then
  echo "Please provide arguments -q (query), -l (article limit), -p (project code) and -c (columns)"
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

# TODO: Add ami plugins

ami2-sequence --project $CODE/data --filter file\(\*\*/results.xml\) -o sequencesfiles.xml

echo "Converting to JSON:"
node ../js/ctj.js -p ../data/$CODE/data -o ../data/$CODE/data -c $COLUMNS
node ../js/card.js -p ../data/$CODE/data -c $COLUMNS
node ../js/card-words.js -p ../data/$CODE/data

echo "Removing unnecessary files..."
# rm -rf $CODE/data/