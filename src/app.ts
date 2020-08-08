import express from 'express'
import session from 'express-session'
import morgan from 'morgan'
import dayjs from 'dayjs'
import marked from 'marked'
import sanitizeHtml from 'sanitize-html'
import sessionSetting from './utils/sessionSetting'
import flashyFlash from './utils/flashyFlash'
import Article from './handlers/article'

const app = express()

app.set('view engine', 'ejs')

app.locals.dayjs = dayjs
app.locals.marked = marked
app.locals.sanitizeHtml = sanitizeHtml

app.use(morgan('common'))
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(session(sessionSetting()))
app.use(flashyFlash)

app.get('/', async function (req: any, res: any) {
    res.redirect('/article')
})

app.get('/article', Article.index)
app.post('/article', Article.store)
app.get('/article/create', Article.create)
app.get('/article/:slug', Article.show)

export default app