import winston, { Logger } from 'winston';
import path from 'path';

function initLogger(uid: string): Logger {
    const logger = winston.createLogger({
        level: process.env.LOG_LEVEL || 'info',
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.label({ label: uid }),
            winston.format.timestamp(),
            winston.format.printf(
                (log) => `${log.timestamp} [${log.label}] (${log.level}): ${log.message}`,
            ),
        ),
    });

    logger.add(
        // new winston.transports.File({
        //     filename: process.env.LOG_FILE_PATH || `${path.dirname(require.main.filename)}/logs/default.log`,
        // }),
        new winston.transports.Console(),
    );

    return logger;
}

export default initLogger;
