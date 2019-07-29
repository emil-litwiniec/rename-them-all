const sizeOf = require('image-size');
var exports = module.exports = {};


exports.index = (fileName, index) => {

const regex = /\[#{1,3}\]/g;
const oneHash = /\[#\]/g;
const twoHashes = /\[##\]/g;
const threeHashes = /\[###\]/g;
const zeros = (hashes, index) => {
    const length = index.toString().length;
    if (hashes == 2) {
        switch (length) {
            case 1:
                return '0';
            default:
                return '';
        }
    } else if (hashes == 3) {
        switch (length) {
            case 1:
                return '00';
            case 2:
                return '0';
            default:
                return '';
        }
    }
}

if (!fileName.match(regex)) {
    return fileName;
}

switch (fileName.match(regex)[0]) {
    case '[#]':
        return fileName.replace(oneHash, index);
    case '[##]':
        return fileName.replace(twoHashes, `${zeros(2, index)}${index}`);
    case '[###]':
        return fileName.replace(threeHashes, `${zeros(3, index)}${index}`);
    default:
        break;
}

};
exports.imageSize = (fileName, targetStr) => {
const regex = /\[[w,h]{1,2}\]/g;

const {
    width,
    height
} = sizeOf(fileName);
switch (targetStr.match(regex)[0]) {
    case '[w]':
        return targetStr.replace(regex, width);
    case '[h]':
        return targetStr.replace(regex, height);
    case '[hw]':
        return targetStr.replace(regex, `${height}x${width}`);
    case '[wh]':
        return targetStr.replace(regex, `${width}x${height}`);
    default:
        break;
}


};

exports.imageSizeGroup = (fullFileName, type) => {
    const imageSizeRanges = {
        small: [1, 122500],
        medium: [122501, 840000],
        large: [840001, Infinity]
    }
    const {
        width,
        height
    } = sizeOf(fullFileName);
    const size = width * height;
    let sizesArr = Object.entries(imageSizeRanges);
    for (let i = 0; i < sizesArr.length; i++) {
        if (size >= sizesArr[i][1][0] && size <= sizesArr[i][1][1]) {
            if(type === "suffix") {
                return `_${sizesArr[i][0]}`;

            } else if (type === "prefix") {
                return `${sizesArr[i][0]}_`;
            }
        }
    }
}
