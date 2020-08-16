import { Request, Response } from '../utils/interface'
import bcrypt from 'bcrypt'
import UserModel from '../model/User'
import { errorLogger } from '../utils/logger'
import config from '../utils/config'

class UserController {
    create(req: Request, res: Response) {
        res.render('user_create', {
            title: 'Register User',
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

            if (req.setFlash) {
                req.setFlash(':ok|Registration successfull.')
            }

            return res.redirect('/register')

        } catch (err) {
            const { method, url } = req
            const { message } = err
            errorLogger(method, url, message)
            return res.redirect('/error')
        }
    }

    edit(req: Request, res: Response) {
        res.render('user_update', {
            title: 'Change Password'
        })
    }

    async update(req: Request, res: Response) {
        const { newPassword } = req.body
        const { id } = req.params
        const { SALT_ROUND } = config

        try {
            const hash = await bcrypt.hash(newPassword, +SALT_ROUND)
            const User = new UserModel()
            await User.update(id, { hash })

            if (req.setFlash) {
                req.setFlash('Password succesfully changed.')
            }

            return res.redirect('/backoffice/user/' + id)
        } catch (err) {
            const { method, url } = req
            const { message } = err
            errorLogger(method, url, message)
            return res.redirect('/error')
        }
    }
}

export default new UserController