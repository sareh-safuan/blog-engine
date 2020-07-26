import express from 'express'
import bcrypt from 'bcrypt'
import UserModel from '../model/User'
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
    '/register',
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

        try {

            const { username, email, password: plainPassword } = req.body
            const password = await bcrypt.hash(plainPassword, 10)
            const User = new UserModel()
            const result = await User.insertOne({
                username,
                email,
                password
            })

            if (result.insertedCount !== 1) {
                throw new Error()
            }

            req.flash('Register success')
            return res.redirect('/user')

        } catch (err) {
            req.flash('Counter an error. Please try again later')
            return res.redirect('/user/create')
        }
    })

router.post(
    '/login',
    [guest, loginUser],
    async (req: any, res: any) => {

        try {

            const { email, password: plainPassword } = req.body
            const User = new UserModel()
            const result = await User.findOne('email', email)

            if (!result) {
                req.flash('Email not found')
                return res.redirect('/user')
            }

            const { _id, username, password: hash } = result
            const isPasswordMatched = await bcrypt.compare(plainPassword, hash)

            if (!isPasswordMatched) {
                req.flash('Incorrect password')
                return res.redirect('/user')
            }

            req.flash('Login success')
            req.session.user = {
                _id,
                username,
                email
            }
            return res.redirect('/user')

        } catch (err) {
            req.flash('Countering an error. Please try again later')
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
            req.flash('Unauthorized action')
            return res.redirect('/user')
        }

        try {

            const User = new UserModel()
            const result = await User.findOne('_id', id)

            if (!result) {
                throw new Error()
            }

            res.render('user_edit', {
                user: req.session.user,
                flash: req.session.flash
            })

        } catch (err) {
            req.flash('Countering an error. Please try again later')
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
            req.flash('Unauthorized action')
            return res.redirect(`/user/${id}/edit`)
        }

        try {

            const User = new UserModel()
            const result = await User.updateOne('_id', id, {
                username,
                email
            })

            if (!result.ok) {
                throw new Error()
            } else {
                const { username, email } = result.value
                req.flash('Successfully updated')
                req.session.user = {
                    _id: id,
                    username,
                    email
                }
                return res.redirect(`/user/${id}/edit`)
            }

        } catch (err) {
            req.flash('Countering an error. Please try again later')
            return res.redirect(`/user/${id}/edit`)
        }
    })

export default router