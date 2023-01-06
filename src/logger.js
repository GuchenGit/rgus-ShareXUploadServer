const { createLogger, format, transports } = require('winston');
const config = require('./config');
const { combine, timestamp, label, printf } = format;

const myFormat = printf(({
    level,
    message,
    timestamp
}) => {
    let msg = `${timestamp} [${level}] : ${message} `
    return msg
});

// Logger
const logger = createLogger({
    level: 'debug',
    format: combine(
        format.splat(),
        timestamp(),
        myFormat
    ),
    transports: [
        new transports.Console(),
        new transports.File({
            filename: config.logFile
        })
    ]
});

module.exports = {
    logger
}