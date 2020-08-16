import { Request, Response, NextFunction } from '../utils/interface'
import UserModel from '../model/User'
import config from '../utils/config'
import { errorLogger } from '../utils/logger'

async function disableRegistration(req: Request, res: Response, next: NextFunction) {
    try {
        const User = new UserModel()
        const count: number = await User.count()
        const { ALLOW_USER } = config

        if (count >= +ALLOW_USER) {
            if (req.setFlash) {
                req.setFlash('Registration disabled at the moment.')
            }

            return res.redirect('/register')
        }

        next()

    } catch (err) {
        const { method, url } = req
        const { message } = err
        errorLogger(method, url, message)
        return res.redirect('/error')
    }
}

export default disableRegistration