import { Request, Response } from '../utils/interface'
import bcrypt from 'bcrypt'
import UserModel from '../model/User'
import { errorLogger } from '../utils/logger'
import config from '../utils/config'

class UserController {
    create(req: Request, res: Response) {
        res.render('user_create', {
            title: 'Register User | smsafuan.com',
            index: false
        })
    }

    async store(req: Request, res: Response) {
        const { username, email, password } = req.body
        const { SALT_ROUND } = config

        try {
            const User = new UserModel
            const hash = await bcrypt.hash(password, +SALT_ROUND)
            await User.save({
                username,
                email,
                hash
            })

            return res.redirect('/register')

        } catch (err) {
            const { method, url } = req
            const { message } = err
            errorLogger(method, url, message)
            return res.redirect('/error')
        }
    }

    edit(req: Request, res: Response) {}

    async update(req: Request, res: Response) {}
}

export default new UserController