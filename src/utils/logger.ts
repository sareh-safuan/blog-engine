import { createLogger, format, transports } from 'winston'

const formatter = format.printf(
    ({timestamp, message}) => {
        return `${timestamp}: ${message}`
    })

const logger = createLogger({
    format: format.combine(
        format.timestamp(),
        formatter
    ),
    transports: [new transports.Console()]
})

export function infoLogger (message: string) {
    logger.info(message)
}

export function errorLogger (method: string, url: string, errorMessage: string) {
    const message = `[${method}: ${url}] | ${errorMessage}`
    logger.error(message)
}

