import express from 'express'
import session from 'express-session'
import user from './controller/user'

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

    res.render('index', {
        title: 'Welcome',
        message: 'It\'s a man world...'
    })
})

app.use('/user', user)

export default app