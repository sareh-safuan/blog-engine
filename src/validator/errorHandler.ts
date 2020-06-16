import { validationResult } from 'express-validator'

const errorHandler = (req: any) => {

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const msg = errors.array().map((err: any) => {
            return err.msg
        })
        req.flash(msg)

        return true
    }

    return false

}

export default errorHandler