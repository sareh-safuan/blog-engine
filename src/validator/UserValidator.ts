import { body, param, validationResult } from "express-validator"
import User from '../model/User'

export const createUser = (req: any, res: any, next: any) => {

    Promise.all([
        body('username', 'Username should be more than 3 characters')
            .isLength({ min: 3 }).run(req),

        body('email', 'Invalid email')
            .isEmail()
            .custom((value: string) => {
                return User.findOne('email', value).then(user => {
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
            }).run(req)

    ])
        .then(() => {
            const hasBadRequest = isBadRequest(req)

            if (hasBadRequest) {
                res.redirect('/user/create')
            } else {
                next()
            }
        })

}

export const loginUser = (req: any, res: any, next: any) => {

    Promise.all([
        body('email', 'Invalid email')
            .isEmail()
            .run(req),

        body('password', 'Password should be more than 8 characters')
            .isLength({ min: 8 }).run(req)
    ])
        .then(() => {
            const hasBadRequest = isBadRequest(req)

            if (hasBadRequest) {
                res.redirect('/user')
            } else {
                next()
            }
        })

}

export const updateUser = (req: any, res: any, next: any) => {

    Promise.all([
        body('username', 'Username should be more than 3 characters')
            .isLength({ min: 3 }).run(req),

        body('email', 'Invalid email')
            .isEmail()
            .custom((value: string) => {
                return User.findOne('email', value).then(user => {
                    if (user) {
                        return Promise.reject('Email already registered')
                    }
                })
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
            const hasBadRequest = isBadRequest(req)

            if (hasBadRequest) {
                res.redirect(`/user/${req.session.user._id}/edit`)
            } else {
                next()
            }
        })

}

const isBadRequest = (req: any) => {

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const msg = errors.array().map((err: any) => {
            return err.msg
        })
        req.session.flash = { ct: 0, msg: msg }

        return true
    }

    return false

}