const fs = require('fs');
const prompt = require('prompt');

console.log('===============================================================');
console.log('                WELCOME TO DIRECTORY INSPECTOR');
console.log('===============================================================');

console.log('Type the directory you want me to inspect');

prompt.start();

prompt.get('path', (err, result) => {
  if (err) {
    throw err;
  }

  const regex = /^((?!Windows).)*$/;

  if (!result.path.match(regex)) {
    return console.log('For security reasons this app can not be used inside Windows directories');
  } else if (result.path === '') {
    return getCurrentFilenames(__dirname);
  }

  return getCurrentFilenames(result.path);
});

function getCurrentFilenames (path) {
  const regex = /\\/g;
  path = path.replace(regex, '/');

  try {
    if (!fs.existsSync(path)) {
      return console.log('This directory doesn\'t exist');
    }
  } catch (err) {
    console.log(err);
  }

  console.log('-> Current filenames:');

  fs.readdirSync(path).forEach(file => {
    fs.stat(`${path}/${file}`, (err, stats) => {
      if (err) {
        console.log('File doesn\'t exist.');
        console.log(err);
      } else {
        if (stats.size === 0) {
          console.log(' ');
          console.log(`Name: ${file}/`);
          console.log(`Created: ${new Date(stats.birthtime).toDateString()}`);
        } else {
          console.log(' ');
          console.log(`Name: ${file}`);
          console.log(`Size: ${stats.size} bytes`);
          console.log(`Created: ${new Date(stats.birthtime).toDateString()}`);
        }
      }
    });
  });
}
