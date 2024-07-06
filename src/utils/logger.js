import winston from 'winston';
const { combine, timestamp, json } = winston.format;

export const infoLogger = winston.createLogger({
    level: 'info',
    format: combine(
        timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        json(),
    ),
    transports: [
        new winston.transports.Console({
            level: 'info'
        })
    ],
});

export const warnLogger = winston.createLogger({
    level: 'warn',
    format: combine(
        timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        json(),
    ),
    transports: [
        new winston.transports.File({
            filename: './logs/warn.log',
            level: 'warn',
        })
    ],
});

export const errorLogger = winston.createLogger({
    level: 'error',
    format: combine(
        timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        json(),
    ),
    transports: [
        new winston.transports.File({
            filename: './logs/error.log',
            level: 'error',
        }),
    ],
});

export default {
    infoLogger,
    warnLogger,
    errorLogger
}