const fs = require('fs')
const { logger } = require('./logger');

// Password comparison
var authChecker = (input) => {
    if(input == process.env.PASSWORD) {
        return true;
    } else {
        return false;
    }
};

// Retrieving the file extension of the upload
var getFileExtension = (filename) => {
    return filename.substring(filename.lastIndexOf('.')+1, filename.length) || filename;
}

const deleteDir = (filePath) => {
    fs.rmSync(filePath, { recursive: true, force: true });
    logger.info("File in path " + filePath + " deleted.");
}


module.exports = {
    authChecker,
    getFileExtension,
    deleteDir
}