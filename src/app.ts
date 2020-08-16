import express from 'express'
import session from 'express-session'
import morgan from 'morgan'
import dayjs from 'dayjs'
import marked from 'marked'
import sanitizeHtml from 'sanitize-html'
import helmet from 'helmet'
import sessionSetting from './utils/sessionSetting'
import flashyFlash from './middleware/flashyFlash'
import disableRegistration from './middleware/disableRegistration'
import Article from './handlers/article'
import User from './handlers/user'
import Auth from './handlers/auth'
import Other from './handlers/other'
import guest from './middleware/guest'
import secured from './middleware/secured'
import setLocal from './middleware/setLocal'
import { vCreateArticle, vUpdateArticle } from './validator/ArticleValidator'
import { vUserLogin, vUserRegister, vUserUpdate } from './validator/UserValidator'
import { LoggerStream } from './utils/logger'

const app = express()

app.set('view engine', 'ejs')
app.set('trust proxy', 1)

app.locals.dayjs = dayjs
app.locals.marked = marked
app.locals.sanitizeHtml = sanitizeHtml

app.use(express.static('public'))
app.use(morgan('common', { stream: new LoggerStream }))
app.use(express.urlencoded({ extended: true }))
app.use(session(sessionSetting()))
app.use(helmet())
app.use(flashyFlash)
app.use(setLocal)

app.get('/', Other.home)

app.get('/article', Article.index)
app.get('/article/:slug', Article.show)

app.get('/register', [guest], User.create)
app.post('/register', [guest, disableRegistration, vUserRegister], User.store)
app.get('/login', guest, Auth.login)
app.post('/login', [guest, vUserLogin], Auth.profile)
app.get('/logout', secured, Auth.logout)

app.get('/backoffice', secured, Other.dashboard)
app.post('/backoffice/article', [secured, vCreateArticle], Article.store)
app.get('/backoffice/article/create', secured, Article.create)
app.get('/backoffice/article/:id/edit', secured, Article.edit)
app.post('/backoffice/article/:id', [secured, vUpdateArticle], Article.update)

app.get('/backoffice/user/:id', secured, User.edit)
app.post('/backoffice/user/:id', [secured, vUserUpdate], User.update)

app.get('/error', Other.error)
app.all('*', Other.notFound)

export default app


/**
 * 
 * NEXT
 *  - seach by keyword **low priority
 *  - search by category **low priority
 */