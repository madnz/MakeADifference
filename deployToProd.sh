#!/bin/bash
echo 'Deploy begun'
rsync -av --exclude='.git' --exclude='.idea' --exclude='README.md' --exclude='deployToProd.sh' ./ ../madnz.github.io/
cd ../madnz.github.io
git add .
git commit -m "Update from ./MakeADifference"
git push
cd ../MakeADifference/
echo 'Deploy completed'