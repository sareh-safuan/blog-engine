import { errorLogger } from './logger'

function errorHandler(method: string, url: string, errorMessage: string) {
    errorLogger(method, url, errorMessage)

    return {
        title: 'Error | smsafuan.com'
    }
}

export default errorHandler