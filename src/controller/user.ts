import express from 'express'
import bcrypt from 'bcrypt'
import User from '../model/User'
import { createUser, loginUser, updateUser } from '../validator/UserValidator'
import secured from '../middleware/secured'

const router = express.Router()

router.get('/', (req: any, res: any) => {

    res.render('user_index', {
        title: 'User',
        flash: req.session.flash,
        user: req.session.user
    })

})

router.get('/create', (req: any, res: any) => {

    res.render('user_register', {
        title: 'Register',
        flash: req.session.flash
    })

})

router.post('/', createUser, async (req: any, res: any) => {

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
        res.redirect('/user')

    } catch (err) {

        res.end('Counter an error. Please try again later')

    }

})

router.post('/login', loginUser, async (req: any, res: any) => {

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
                res.redirect('/user')
            } else {
                req.session.flash = {
                    ct: 0,
                    msg: 'Password incorrect'
                }
                res.redirect('/user')
            }
        } else {
            req.session.flash = {
                ct: 0,
                msg: 'Email not found'
            }
            res.redirect('/user')
        }

    } catch (err) {

        req.session.flash = {
            ct: 0,
            msg: 'Countering an error. Please try again later'
        }
        res.redirect('/user')

    }

})

router.get('/:id/edit', secured, async (req: any, res: any) => {

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
            req.session.flash = {
                ct: 0,
                msg: 'Unauthorized action'
            }
            return res.redirect('/user')
        }

    } catch (err) {

        req.session.flash = {
            ct: 0,
            msg: 'Countering an error. Please try again later'
        }
        res.redirect('/user')

    }

})

router.post('/:id', updateUser, (req: any, res: any) => {
    res.end('update a user')
})

export default router

/**
 * bonjovi - 5ed9a96d047dbd06a0f32a28
 *
 * europe - 5ed9a680bc179f0d40871a7c
 *
 */