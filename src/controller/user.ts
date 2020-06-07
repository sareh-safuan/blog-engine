import express from 'express'
import bcrypt from 'bcrypt'
import User from '../model/User'
import { createUser, loginUser, updateUser } from '../validator/UserValidator'
import secured from '../middleware/secured'
import guest from '../middleware/guest'

const router = express.Router()

router.get(
    '/',
    (req: any, res: any) => {

        res.render('user_index', {
            title: 'User',
            flash: req.session.flash,
            user: req.session.user
        })

    })

router.get(
    '/create',
    guest,
    (req: any, res: any) => {

        res.render('user_register', {
            title: 'Register',
            flash: req.session.flash
        })

    })

router.post(
    '/',
    [guest, createUser],
    async (req: any, res: any) => {

        const { username, email, password: plainPassword } = req.body
        const password = await bcrypt.hash(plainPassword, 10)
        try {

            const result = await User.create({
                username,
                email,
                password
            })

            if (result.insertedCount !== 1) throw new Error()

            req.session.flash = { ct: 0, msg: 'Register success' }
            return res.redirect('/user')

        } catch (err) {

            res.end('Counter an error. Please try again later')

        }

    })

router.post(
    '/login',
    [guest, loginUser],
    async (req: any, res: any) => {

        const { email, password: plainPassword } = req.body
        try {

            const result = await User.findOne('email', email)
            if (result) {
                const { _id, username, email, password: hash } = result
                const isPasswordMatched = await bcrypt.compare(plainPassword, hash)

                if (isPasswordMatched) {
                    req.session.flash = {
                        ct: 0,
                        msg: 'Login success'
                    }
                    req.session.user = {
                        _id,
                        username,
                        email
                    }
                } else {
                    req.session.flash = {
                        ct: 0,
                        msg: 'Incorrect password'
                    }
                }
            } else {
                req.session.flash = {
                    ct: 0,
                    msg: 'Email not found'
                }
            }
            return res.redirect('/user')

        } catch (err) {

            req.session.flash = {
                ct: 0,
                msg: 'Countering an error. Please try again later'
            }
            return res.redirect('/user')

        }

    })

router.get(
    '/logout',
    secured,
    (req: any, res: any) => {

        req.session.destroy()
        res.render('user_index', {
            title: 'User'
        })

    })

router.get(
    '/:id/edit',
    secured,
    async (req: any, res: any) => {

    const { id } = req.params
    if (id !== req.session.user._id) {
        req.session.flash = {
            ct: 0,
            msg: 'Unauthorized action'
        }
        return res.redirect('/user')
    }

    try {

        const result = await User.findOne('_id', id)
        if (result) {
            res.render('user_edit', {
                user: req.session.user,
                flash: req.session.flash
            })
        } else {
            throw new Error()
        }

    } catch (err) {

        req.session.flash = {
            ct: 0,
            msg: 'Countering an error. Please try again later'
        }
        return res.redirect('/user')

    }

})

router.post(
    '/:id',
    [secured, updateUser],
    async (req: any, res: any) => {

    const { username, email } = req.body
    const { id } = req.params
    if (id !== req.session.user._id) {
        req.session.flash = {
            ct: 0,
            msg: 'Unauthorized action'
        }
        return res.redirect(`/user/${id}/edit`)
    }

    try {

        const result = await User.findOneAndUpdate('_id', id, {
            username,
            email
        })
        if (result.ok) {
            const { username, email } = result.value

            req.session.flash = {
                ct: 0,
                msg: 'Successfully updated'
            }
            req.session.user = {
                _id: id,
                username,
                email
            }

            return res.redirect(`/user/${id}/edit`)
        } else {
            throw new Error()
        }

    } catch (err) {

        req.session.flash = {
            ct: 0,
            msg: 'Countering an error. Please try again later'
        }
        return res.redirect(`/user/${id}/edit`)

    }

})

export default router