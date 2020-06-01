import express from 'express'
import { createUser } from './validator/UserValidator'

const router = express.Router()

router.get('/', (req: any, res: any) => {
    res.render('index',{ index: 'Stayin alive', message: 'We can try to understand...nope' })
})

router.get('/create', (req: any, res: any) => {

    res.render('user_register', {
        title: 'Register',
        flash: req.session.flash
    })

})

router.post('/', createUser, (req: any, res: any) => {

    const { username, email, password } = req.body
    res.end('Ku bersuara')

})

router.get('/:id', (req: any, res: any) => {
    res.end('find a user')
})

router.get('/:id/edit', (req: any, res: any) => { })

router.post('/:id', (req: any, res: any) => {
    res.end('update a user')
})

export default router