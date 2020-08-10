import express from 'express'
import session from 'express-session'
import morgan from 'morgan'
import dayjs from 'dayjs'
import marked from 'marked'
import sanitizeHtml from 'sanitize-html'
import sessionSetting from './utils/sessionSetting'
import flashyFlash from './middleware/flashyFlash'
import Article from './handlers/article'
import User from './handlers/user'
import Auth from './handlers/auth'
import Other from './handlers/other'
import guest from './middleware/guest'
import secured from './middleware/secured'
import setLocal from './middleware/setLocal'
import { vCreateArticle } from './validator/ArticleValidator'
import { vUserLogin, vUserRegister, vUserUpdate } from './validator/UserValidator'

const app = express()

app.set('view engine', 'ejs')

app.locals.dayjs = dayjs
app.locals.marked = marked
app.locals.sanitizeHtml = sanitizeHtml

app.use(express.static('public'))
app.use(morgan('common'))
app.use(express.urlencoded({ extended: true }))
app.use(session(sessionSetting()))
app.use(flashyFlash)
app.use(setLocal)

app.get('/', Other.home)

app.get('/article', Article.index)
app.get('/article/:slug', Article.show)

app.get('/register', [guest], User.create)
app.post('/register', [guest, vUserRegister], User.store)
app.get('/login', guest, Auth.login)
app.post('/login', [guest, vUserLogin], Auth.profile)
app.get('/logout', Auth.logout)

app.get('/backoffice', secured, Other.dashboard)
app.post('/backoffice/article', [secured, vCreateArticle], Article.store)
app.get('/backoffice/article/create', secured, Article.create)
app.get('/backoffice/user/:id', secured, User.edit)
app.post('/backoffice/user/:id', [secured, vUserUpdate], User.update)

app.get('/error', Other.error)
app.all('*', Other.notFound)

export default app


/**
 * TODO
 *  - title add | smsafuan.com add header, remove redundant
 *  - update article, change password
 *  - links to create article, change password
 *  - add mongodb session store
 */