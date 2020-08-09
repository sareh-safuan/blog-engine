import { Request } from '../utils/interface'
import { validationResult } from 'express-validator'
import { errorLogger } from '../utils/logger'

const errorChecker = (req: Request) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        const { method, url } = req
        let message = ''
        errors.array().forEach(function (e) {
            message += '[' + e.location + '|' + e.msg + '|' + e.param + ']'
        })
        errorLogger(method, url, message)

        if (req.setFlash) {
            req.setFlash('Please fill the required field.')
        }
        return true
    }

    return false
}

export default errorChecker