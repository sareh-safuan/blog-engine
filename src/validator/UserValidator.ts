import { body, param } from 'express-validator'
import errorChecker from './errorChecker'
import UserModel from '../model/User'

export const vUserRegister = (req: any, res: any, next: any) => {
    Promise.all([
        body('username', 'Username should be more than 3 characters')
            .isLength({ min: 5, max: 15 })
            .run(req),
        body('email', 'Invalid email')
            .isEmail()
            .custom((value: string) => {
                const User = new UserModel()

                return User.detail('email', value).then((user: any) => {
                    if (user) {
                        return Promise.reject('Email already registered')
                    }
                })
            })
            .run(req),
        body('password', 'Password should be more than 8 characters')
            .isLength({ min: 8 }).run(req),
        body('re_password', 'Password confirmation is not matched')
            .custom((value: string) => {
                if (value !== req.body.password) {
                    return false
                }
                return true
            })
            .run(req)
    ])
        .then(() => {
            const hasBadRequest = errorChecker(req)

            if (hasBadRequest) {
                return res.redirect('/register')
            }
            next()
        })

}

export const vUserLogin = (req: any, res: any, next: any) => {
    Promise.all([
        body('email', 'Invalid email')
            .isEmail()
            .run(req),
        body('password', 'Password should be more than 8 characters')
            .isLength({ min: 8 }).run(req)
    ])
        .then(() => {
            const hasBadRequest = errorChecker(req)

            if (hasBadRequest) {
                return res.redirect('/login')
            }
            next()
        })

}

export const vUserUpdate = (req: any, res: any, next: any) => {
    Promise.all([
        body('username', 'Username should be more than 3 characters')
            .isLength({ min: 3 }).run(req),
        body('email', 'Invalid email')
            .isEmail()
            .custom((value: string) => {
                if (value !== req.session.user.email) {
                    const User = new UserModel()
                    return User.detail('email', value).then((user: any) => {
                        if (user) {
                            return Promise.reject('Email already registered')
                        }
                    })
                }

                return true
            })
            .run(req),
        param('id', 'Unauthorized access')
            .custom((value: string) => {
                if (value !== req.session.user._id) {
                    return false
                }

                return true
            })
    ])
        .then(() => {
            const hasBadRequest = errorChecker(req)

            if (hasBadRequest) {
                return res.redirect(`/user/${req.session.user._id}/edit`)
            }
            next()
        })
}