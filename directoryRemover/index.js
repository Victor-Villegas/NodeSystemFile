const fs = require('fs');
const readline = require('readline');
const rl = readline.createInterface(process.stdin, process.stdout);

console.log('===============================================================');
console.log('                WELCOME TO DIRECTORY REMOVER');
console.log('===============================================================');

console.log('Type the directory you want me to remove');

rl.question('Path: ', function (answer) {
  const regex = /^((?!Windows).)*$/;

  if (!answer.match(regex)) {
    return console.log('For security reasons this app can not be used inside Windows directories');
  }

  return removeDirectory(answer);
});

function removeDirectory (path) {
  const regex = /\\/g;
  path = path.replace(regex, '/');

  try {
    if (!fs.existsSync(path)) {
      return console.log('This directory doesn\'t exist');
    }
  } catch (err) {
    console.log(err);
  }

  const filesToDelete = fs.readdirSync(path).length;

  if (filesToDelete > 0) {
    rl.question(`Delete ${path}? [yes]/no: `, function (answer) {
      if (answer === 'no') {
        return console.log('Operation canceled by user');
      } else {
        console.log(`Deleting ${getAllDirFiles(path)} files...`);
        fs.rmdirSync(path, {
          recursive: true
        });
        console.log('Files deleted');
      }
    });
  } else {
    fs.rmdirSync(path, {
      recursive: true
    });
    console.log('Files deleted');
  }
}

const getAllDirFiles = function (dirPath, sum = 0) {
  const files = fs.readdirSync(dirPath);

  files.forEach(function (file) {
    if (fs.statSync(dirPath + '/' + file).isDirectory()) {
      sum += getAllDirFiles(dirPath + '/' + file, sum);
    } else {
      sum++;
    }
  });

  return sum;
};
