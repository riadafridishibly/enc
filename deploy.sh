#!/bin/bash
set -e

pushd frontend
echo 'Building....'
yarn build
popd

echo 'Switching branch...'
git switch gh-pages
echo 'Removing files...'
rm -rf assets index.html logo.svg
echo 'Copying files...'
mv frontend/dist/* .
git add assets index.html
git commit -m "deploy"
git push origin gh-pages
git switch -
