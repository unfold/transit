#!/bin/bash -e

babel=node_modules/.bin/babel
webpack=node_modules/.bin/webpack

rm -rf build
$babel -d build/lib ./src --loose
# cp README.md build/
node -p 'p=require("./package");p.main="lib";p.scripts=p.devDependencies=undefined;JSON.stringify(p,null,2)' > build/package.json
