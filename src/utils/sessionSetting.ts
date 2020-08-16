import session from 'express-session'
import mongodbstore from 'connect-mongodb-session'
import config from './config'

const { DB_URL, DB_NAME, DB_SESSION_COLLECTION } = config
const MongoDBStore = mongodbstore(session)
const store = new MongoDBStore({
    uri: DB_URL + '/' + DB_NAME,
    collection: DB_SESSION_COLLECTION
})

function sessionSetting() {
    const { NODE_ENV, SESSION_SECRET } = config

    const setting = {
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        store,
        cookie: {
            secure: false
        }
    }

    if (NODE_ENV === 'production') {
        setting.cookie.secure = true
    }

    return setting
}

export default sessionSetting