const chalk = require('chalk');

var exports = module.exports = {};
const util = require('util');
const fs = require('fs');
const path = require('path');
const insert = require('./insert');
const utils = require('./utils');
const naturalCompare = require('natural-compare-lite');

const logError = (err) => {
    console.log(chalk.red(err));
} 

const rename = util.promisify(fs.rename);



exports.runRename = (argv) => {

    const inputType = argv.type;
    const prefix = argv.prefix;
    const suffix = argv.suffix;
    const inputTypeGroup = argv.typeGroup;
    const pathToFiles = process.cwd();
    const inputFileName =  argv._[0] || argv.fileName;
    const imageSizeGroup = argv.imageSizeGroup;
    let files;

    const typeGroups = {
        images: ['jpeg', 'jpg', 'png', 'bmp', 'tiff', 'gif'],
        docs: ['txt', 'doc', 'docs', 'pdf', 'epub', 'mobi'],
        audio: ['mp3', 'wav', 'mpeg4', 'flac', 'ogg'],
        video: ['avi', 'mp4', 'mkv']
    };

    (function createFilesList() {

        const compare = (a, b) => {
            return naturalCompare(a.name, b.name);
        };

        files = fs.readdirSync(pathToFiles)
            .map(file => path.parse(file))
            .sort(compare);
        
        // exclude mac hidden folder setting file
        files = files.filter(file => file.name !== ".DS_Store");

        // exclude elements without extensions ( folders )
        files = files.filter(file => file.ext !== "");


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
        try {

            files.forEach((file, index) => {
                let fullFileName = `${pathToFiles}/${file.name}${file.ext}`
                let newFileName = utils.availableFileName(newName, index + 1, insert.index, pathToFiles);
                
                // check if input type group is set to images, then adds dimensions to the file name
                if (newFileName.match(imageSizeRegex) && inputTypeGroup == 'images') {
                    newFileName = insert.imageSize(fullFileName, newFileName);
                } else if (newFileName.match(imageSizeRegex)) {
                    newFileName = utils.removeUnusedVariable(newFileName);
                }
                console.log(`${file.name}${file.ext} -> ${newFileName}${file.ext}`);
                let fullNewName = `${pathToFiles}/${newFileName}${file.ext}`;
                
                rename(fullFileName, fullNewName).catch(err => logError(err));
            });
        } catch (err) {

            console.log("Can't rename! Please, choose different file name.")
            process.exit(1);
        }

    };
    const addSuffix = (files, suffix) => {
        files.forEach((file, index) => {
            let fullFileName = `${pathToFiles}/${file.name}${file.ext}`
            let suffixedName = imageSizeGroup ? `${file.name}${insert.imageSizeGroup(fullFileName, 'suffix')}` : `${file.name}${suffix}`;

            console.log(`${file.name}${file.ext} -> ${suffixedName}${file.ext}`);

            let fullNewName = `${pathToFiles}/${insert.index(suffixedName, index + 1)}${file.ext}`
            rename(fullFileName, fullNewName).catch(err => logError(err));
        });

    };
    const addPrefix = (files, prefix) => {
        files.forEach((file, index) => {
            // let prefixedName = `${prefix}${file.name}`;
            let fullFileName = `${pathToFiles}/${file.name}${file.ext}`
            let prefixedName = imageSizeGroup ? `${insert.imageSizeGroup(fullFileName, 'prefix')}${file.name}` : `${prefix}${file.name}`;

            console.log(`${file.name}${file.ext} -> ${prefixedName}${file.ext}`);

            let fullNewName = `${pathToFiles}/${insert.index(prefixedName, index + 1)}${file.ext}`
            rename(fullFileName, fullNewName).catch(err => logError(err));
        });

    };

    const addPrefixAndSuffix = (files, prefix, suffix) => {
        files.forEach((file, index) => {
            let newName = `${prefix}${file.name}${suffix}`;
            let fullFileName = `${pathToFiles}/${file.name}${file.ext}`

            console.log(`${file.name}${file.ext} -> ${newName}${file.ext}`);

            let fullNewName = `${pathToFiles}/${insert.index(newName, index + 1)}${file.ext}`
            rename(fullFileName, fullNewName).catch(err => logError(err));
        });

    };

    suffix && !prefix && addSuffix(files, suffix, imageSizeGroup);
    prefix && !suffix && addPrefix(files, prefix);

    suffix && prefix && addPrefixAndSuffix(files, prefix, suffix);

    inputFileName && renameFiles(files, inputFileName);
}