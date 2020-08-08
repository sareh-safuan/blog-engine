import config from './config'

function sessionSetting() {
    const { NODE_ENV, SESSION_SECRET } = config

    const setting = {
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
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