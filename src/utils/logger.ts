import { createLogger, format, transports, transport } from 'winston'
import config from './config'
import stream from 'stream'

const { NODE_ENV } = config
const formatter = format.printf(
    ({ timestamp, message }) => {
        return `${timestamp}: ${message}`
    })

const appTransports = function () {
    if (NODE_ENV === "production") {
        return [
            new transports.File({
                filename: './log/error.log', level: 'error'
            }),
            new transports.File({
                filename: './log/combined.log'
            })
        ]
    } else {
        return [
            new transports.Console()
        ]
    }
}

const logger = createLogger({
    format: format.combine(
        format.timestamp(),
        formatter
    ),
    transports: appTransports()
})

export function infoLogger(message: string) {
    logger.info(message)
}

export function errorLogger(method: string, url: string, errorMessage: string) {
    const message = `[${method}: ${url}] | ${errorMessage}`
    logger.error(message)
}

export class LoggerStream {
    write(message: string) {
        logger.info(message.substring(0, message.lastIndexOf('\n')));
    }
}
