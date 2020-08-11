import bcrypt from 'bcrypt'
import UserModel from '../model/User'
import { Request, Response } from '../utils/interface'
import { errorLogger, infoLogger } from '../utils/logger'

class AuthController {
    login(req: Request, res: Response) {
        res.render('user_login', {
            title: 'Login'
        })
    }

    logout(req: Request, res: Response) {
        const message = 'User with id ' + req.session.user._id + ' logout.'
        req.session.destroy()
        infoLogger(message)
        return res.redirect('/article')
    }

    async profile(req: Request, res: Response) {
        const { email, password } = req.body

        try {
            const User = new UserModel()
            const user = await User.detail('email', email)
            if (!user) {
                if (req.setFlash) {
                    req.setFlash("Email not found.")
                }
                return res.redirect('/login')
            }

            const isMatch = await bcrypt.compare(password, user.hash)
            if (!isMatch) {
                if (req.setFlash) {
                    req.setFlash("Wrong password.")
                }
                return res.redirect('/login')
            }
            
            req.session.user = {
                _id: user._id,
                username: user.username
            }
            const message = 'User with id ' + req.session.user._id + ' login.'
            infoLogger(message)
            return res.redirect('/backoffice')

        } catch (err) {
            const { method, url } = req
            const { message } = err
            errorLogger(method, url, message)
            res.redirect('/error')
        }
    }
}

export default new AuthController