const fs = require('fs');
const path = require('path');

var exports = module.exports = {};


exports.removeUnusedVariable = (targetStr) => {
    const regex = /\[[w,h]{1,2}\]/g;
    return targetStr.replace(regex, '');
}

exports.availableFileName = (newName, index, cb, pathToFiles) => {
    const newFileName = cb(newName, index);

    updatedFiles = fs.readdirSync(pathToFiles)
        .map(file => path.parse(file));

    // checks if new file name is available
    if (!updatedFiles.some(file => file.name === newFileName)) {

        return newFileName;
    } else {
        // if no
        // runs the function again with different index
        return availableFileName(newName, index + 1, cb)
    }
}