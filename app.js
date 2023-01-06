/* 
Authors: Guchen, Riod
*/

const express = require('express');
const bodyParser = require('body-parser');
const utils = require('./src/utils');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');
const config = require('./src/config');
const { logger } = require('./src/logger');
require('dotenv').config();

// Configure multer
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        const uniqueFolderSuffix = Date.now() + '-' + Math.round(Math.random() * Math.pow(10,(config.uniqueSuffixLength)));
        const dir = config.saveDirectory + uniqueFolderSuffix;
        file.relativeDir = uniqueFolderSuffix;
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir, { recursive: true });
        }
        callback(null, dir);
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
});
const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});

function fileFilter(req, file, callback) {
    // Checking the password
    if (utils.authChecker(req.body.password)) {
        callback(null, true)
        return;
    } else {
        return callback(new Error('Wrong password'));
    }
}




/*
    Express starts here
*/

// Init express
var app = express();
app.set('trust proxy', true);
let timeOuts = [];

// Start server on given port
// Tries to get port from environment, if it fails
// it defaults to 8000
var port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log("Server started on port " + port);
    logger.info("Server started on port " + port);
});

// Main route
// This will likely be implemented in the future but is currently
// left without function for simplicity
app.get('/', (req, res, next) => {
    res.json({
        code: 404,
        message: "Please send a POST request to /send with the parameter 'pass' set"
    });
    return;
});



// Upload route
app.post(config.uploadRoute, (req, res, next) => {
    upload.single('name')(req, res, () => {
        let file = req.file;
        if (!file) {
            logger.warn("IP: "+ req.ip + " used the wrong password.")
            res.status(403).send();
            res.socket.end();
            return;
        } else {
            const timer = setTimeout(() => utils.deleteDir(path.join(__dirname, config.saveDirectoryClean, req.file.relativeDir)), (req.body.livingTime === undefined ? config.defaultLivingTime : req.body.livingTime));
            timeOuts.push(timer);
            logger.info("IP: "+ req.ip + " uploaded file to " + path.join(__dirname, config.saveDirectoryClean, req.file.relativeDir));

            var hash = crypto.pbkdf2Sync(req.file.relativeDir, req.body.password, 1000, 10, 'sha512').toString('hex');
            res.json({
                code: 200,
                path: req.file.relativeDir + '/' + req.file.filename,
                deletePath: req.file.relativeDir,
                deleteKey: hash
            });
        }
    })
});

// View Route
app.get(config.viewRoute, (req, res, next) => {
    var requestedFile = path.join(__dirname, config.saveDirectoryClean + req.params['uniqueURL'], req.params['fileRequested']);
    
    fs.access(requestedFile, fs.F_OK, (err) => {
        if (err) {
            res.status(404).send("404: No such file exists");
            return;
        }
        res.sendFile(requestedFile);
      })
    return;
});

// Delete Route
app.get(config.deleteRoute, (req, res) => {
    var key = req.params['deleteKey'];
    var deletePath = req.params['deletePath'];
    var hash = crypto.pbkdf2Sync(deletePath, process.env.PASSWORD, 1000, 10, 'sha512').toString('hex');
    if (hash === key) {
        utils.deleteDir(path.join(__dirname, config.saveDirectoryClean + req.params['deletePath']))
        
        res.status(200).send("File deleted");
        res.socket.end();
    } else {
        res.status(403).send("Wrong key, unauthorized");
        res.socket.end();
    }
});
