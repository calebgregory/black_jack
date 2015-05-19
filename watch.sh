#!/bin/sh

# install dependencies
npm install

# clean and prepare public directory
rm -rf public
cp -r src public



# convert ES6 JS to ES5
./node_modules/.bin/babel \
  src \
  --out-dir \
  public \
  -s inline \
  -w &

echo "* ~ * ~ * ~ * ~ * ~ * ~ * ~ * ~ * ~ *"
echo "~      Watching for changes...      ~"
echo "* ~ * ~ * ~ * ~ * ~ * ~ * ~ * ~ * ~ *"
