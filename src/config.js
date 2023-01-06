/*
    This module contains most configuration options except for password and port
*/

// Currently only directories within the work directory are supported
exports.saveDirectory = './uploads/';
exports.saveDirectoryClean = '/uploads/';
exports.logFile = 'server.log';
exports.uploadRoute = '/send';
exports.viewRoute = '/view/:uniqueURL*/:fileRequested*';
exports.deleteRoute = '/delete/:deletePath*/:deleteKey*';
exports.uniqueSuffixLength = 4;
exports.defaultLivingTime = 3600000;