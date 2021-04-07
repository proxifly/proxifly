const jetpack = require('fs-jetpack');
const package = require('../package.json');

jetpack.write(
  './dist/index.js',
  jetpack.read('./src/index.js').replace(/{version}/igm, package.version),
)
