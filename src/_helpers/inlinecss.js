const fs          = require('fs');
const path        = require('path');
const Handlebars  = require('handlebars');

module.exports = (assetpath) => {
  const rootPath = path.resolve(process.cwd(), assetpath);
  if (fs.existsSync(rootPath)) {
    return new Handlebars.SafeString(fs.readFileSync(rootPath).toString());
  } else {
    throw new Error('Could not find ' + rootPath);
  }
};
