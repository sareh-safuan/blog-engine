import { MongoClient } from 'mongodb'
import config from '../utils/config'

const { DB_URL, DB_NAME } = config

let conn: any

(async function connect() {
    try {
        const client = await MongoClient.connect(DB_URL, { useUnifiedTopology: true })
        conn = client.db(DB_NAME)
    } catch (err) {
        throw err      
    }
})();

function Database () {
    return conn
}

export default Database