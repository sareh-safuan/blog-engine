import { MongoClient } from 'mongodb'

interface DB {
    init(): any,
    collection(collectionName: string): any,
    close(): any
}

const db = function (): DB {

    let db: any
    let client: any
    const dbUrl: string = process.env.DB_URL || 'mongodb://localhost:27017'
    const dbName: string = process.env.DB_NAME || 'bloggengine'
    const init = async function () {
        try {

            client = await MongoClient.connect(dbUrl, { useUnifiedTopology: true })
            db = client.db(dbName)
            console.log('Connected to database server')

        } catch (error) {

            console.log('Error when connected to database server')
            throw error

        }
    }
    const collection = function (collectionName: string): any {
        return db.collection(collectionName)
    }
    const close = function () {
        client.close()
    }

    return {
        init,
        collection,
        close
    }
    
}

const Database = db()

export default Database