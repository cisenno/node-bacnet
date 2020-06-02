#!/usr/bin/env sh

rm -rf node_modules/

rm -rf docs/

rm -rf reports/

mkdir -p reports/coverage
touch reports/coverage/git.keep

rm -rf .nyc_output/

rm package-lock.json

npm cache verify

npm install

npm i --only=dev

npm test

npm run changelog
