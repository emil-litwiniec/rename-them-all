const chalk = require('chalk');

var exports = module.exports = {};
const util = require('util');
const fs = require('fs');
const path = require('path');
const insert = require('./insert');
const utils = require('./utils');

const logError = (err) => {
    console.log(chalk.red(err));
} 

const rename = util.promisify(fs.rename);

exports.runRename = (argv) => {

    const inputType = argv.type;
    const prefix = argv.prefix;
    const suffix = argv.suffix;
    const inputTypeGroup = argv.typeGroup;
    const pathToFiles = path.join(__dirname, '/mock-files');
    const inputFileName = argv.fileName;
    const imageSizeGroup = argv.imageSizeGroup;
    let files;

    const typeGroups = {
        images: ['jpeg', 'jpg', 'png', 'bmp', 'tiff', 'gif'],
        docs: ['txt', 'doc', 'docs', 'pdf', 'epub', 'mobi'],
        audio: ['mp3', 'wav', 'mpeg4', 'flac', 'ogg'],
        video: ['avi', 'mp4', 'mkv']
    };

    (function createFilesList() {

        files = fs.readdirSync(pathToFiles)
            .map(file => path.parse(file));

        if (inputType) {
            files = files.filter(file => file.ext == `.${inputType}`);
        }

        if (inputTypeGroup) {
            files = files.filter(file =>
                typeGroups[inputTypeGroup].includes(file.ext.slice(1))
            );
        };

    })();

    const renameFiles = (files, newName) => {
        const imageSizeRegex = /\[[w,h]{1,2}\]/g;

        files.forEach((file, index) => {
            let fullFileName = `${pathToFiles}/${file.name}${file.ext}`
            let newFileName = utils.availableFileName(newName, index, insert.index, pathToFiles);

            let fullNewName = `${pathToFiles}/${newFileName}${file.ext}`;

            // check if input type group is set to images, then adds dimensions to the file name
            if (fullNewName.match(imageSizeRegex) && inputTypeGroup == 'images') {
                // insertImageSizeGroup(fullFileName);
                fullNewName = insert.imageSize(fullFileName, fullNewName);
            } else if (fullNewName.match(imageSizeRegex)) {
                fullNewName = utils.removeUnusedVariable(fullNewName);
            }

            rename(fullFileName, fullNewName).catch(err => logError(err));
        });

    };
    const addSuffix = (files, suffix) => {
        files.forEach((file, index) => {
            let fullFileName = `${pathToFiles}/${file.name}${file.ext}`
            let suffixedName = imageSizeGroup ? `${file.name}${insert.imageSizeGroup(fullFileName)}` : `${file.name}${suffix}`;
            let fullNewName = `${pathToFiles}/${insert.index(suffixedName, index + 1)}${file.ext}`
            rename(fullFileName, fullNewName).catch(err => logError(err));
        });

    };
    const addPrefix = (files, prefix) => {
        files.forEach((file, index) => {
            let prefixedName = `${prefix}${file.name}`;
            let fullFileName = `${pathToFiles}/${file.name}${file.ext}`
            let fullNewName = `${pathToFiles}/${insert.index(prefixedName, index + 1)}${file.ext}`
            rename(fullFileName, fullNewName).catch(err => logError(err));
        });

    };

    const addPrefixAndSuffix = (files, prefix, suffix) => {
        files.forEach((file, index) => {
            let prefixedName = `${prefix}${file.name}${suffix}`;
            let fullFileName = `${pathToFiles}/${file.name}${file.ext}`
            let fullNewName = `${pathToFiles}/${insert.index(prefixedName, index + 1)}${file.ext}`
            rename(fullFileName, fullNewName).catch(err => logError(err));
        });

    };

    suffix && !prefix && addSuffix(files, suffix, imageSizeGroup);
    prefix && !suffix && addPrefix(files, prefix);

    suffix && prefix && addPrefixAndSuffix(files, prefix, suffix);

    argv.fileName && renameFiles(files, inputFileName);
}