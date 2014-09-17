#!/bin/bash
shopt -s globstar

for filename in app/**/*.less ; do
  lessc $filename > `echo $filename | sed "s/\.less\$/\.css/"` ; done

exit 0