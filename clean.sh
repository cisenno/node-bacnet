#!/usr/bin/env sh

rm -rf node_modules/

rm -rf docs/

rm -rf reports/

rm package-lock.json

npm cache verify

npm install

npm i --only=dev

npm test

npm run changelog
