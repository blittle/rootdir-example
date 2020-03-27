#! /bin/sh

cd my-dependency
npm link
cd ../app
npm install && npm link my-dependency
npm run build
npm run serve
