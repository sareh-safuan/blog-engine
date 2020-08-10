import { Request, Response, NextFunction, User } from '../utils/interface'
import { body } from 'express-validator'
import bcrypt from 'bcrypt'
import errorChecker from './errorChecker'
import UserModel from '../model/User'

export const vUserRegister = (req: Request, res: Response, next: NextFunction) => {
    Promise.all([
        body('username', 'Username should be more than 3 characters')
            .isLength({ min: 5, max: 15 })
            .run(req),
        body('email', 'Invalid email')
            .isEmail()
            .custom((value: string) => {
                const User = new UserModel()

                return User.detail('email', value).then((user: User) => {
                    if (user) {
                        return Promise.reject('Email already registered')
                    }
                })
            })
            .run(req),
        body('password', 'Password should be more than 8 characters')
            .isLength({ min: 8 })
            .run(req),
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

export const vUserLogin = (req: Request, res: Response, next: NextFunction) => {
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

export const vUserUpdate = (req: Request, res: Response, next: NextFunction) => {
    Promise.all([
        body('currentPassword', 'Current password is incorrect.--')
            .custom(async (value: string) => {
                const User = new UserModel()
                const user = await User.detail('_id', req.params.id)
                const { hash } = user
                const isMatch = await bcrypt.compare(value, hash)

                if (!isMatch) {
                    return Promise.reject('Current password is incorrect.')
                }
            })
            .run(req),
        body('newPassword', 'New password is invalid')
            .not().isEmpty()
            .isLength({ min: 8, max: 32 })
            .custom((value: string) => {
                if (value === req.body.currentPassword) {
                    return false
                }

                return true
            })
            .run(req),
        body('newPasswordConfirmation', 'Password confirmation is not matched')
            .custom((value: string) => {
                if (value !== req.body.newPassword) {
                    return false
                }
                return true
            })
            .run(req)
    ])
        .then(() => {
            const hasBadRequest = errorChecker(req)

            if (hasBadRequest) {
                return res.redirect('/backoffice/user/' + req.params.id)
            }
            next()
        })
}