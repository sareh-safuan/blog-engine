import { errorLogger } from './logger'

function errorHandler(method: string, url: string, message: string) {
    errorLogger(method, url, message)

    return {
        title: 'Error | smsafuan.com'
    }
}

export default errorHandler