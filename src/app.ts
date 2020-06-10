import express from 'express'
import session from 'express-session'
import user from './controller/user'
import article from './controller/article'

const app = express()

app.set('view engine', 'pug')

app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}))
app.use((req: any, res: any, next: any) => {

    req.flash = (msg: string | Array<string>, redirect = true) => {
        const ct = redirect ? 0 : 1
        req.session.flash = {
            ct,
            msg
        }
    }

    if (req.session.flash) {
        if (req.session.flash.ct) {
            req.session.flash = undefined
        } else {
            req.session.flash.ct++
        }
    }

    next()

})

app.get('/', function (req: any, res: any) {

    res.redirect('/article')

})

app.use('/article', article)

app.use('/user', user)

export default app