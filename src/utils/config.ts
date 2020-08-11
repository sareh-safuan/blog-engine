export default {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT || 3000,
    DB_URL: process.env.DB_URL || 'mongodb://localhost:27017',
    DB_NAME: process.env.DB_NAME || 'blogengine',
    SESSION_SECRET: process.env.SESSION_SECRET || 'somerandomstring',
    SALT_ROUND: process.env.SALT_ROUND || 10,
    DB_SESSION_COLLECTION: process.env.DB_SESSION_COLLECTION || 'session'
}