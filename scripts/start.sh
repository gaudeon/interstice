#!/usr/bin/env bash

# since we are relying on github for phaser 3, we need to make sure we generate the phaser dist before we can start...
if [ ! -d node_modules/phaser/dist ]; then
    cd node_modules/phaser
    npm install
    npm build
    npm run dist
    cd ../..
fi

./node_modules/webpack-dev-server/bin/webpack-dev-server.js -d --config config/webpack.config.devserver.js
