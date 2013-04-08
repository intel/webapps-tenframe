#!/bin/bash

# This script generates a widget package k9.wgt inside
# the root directory of this project.

FILE_NAME=$1

if [[ -f $FILE_NAME ]] ; then
  rm $FILE_NAME
fi

zip -r $FILE_NAME icon.png config.xml index.html LICENSE README.txt audio css fonts images js

