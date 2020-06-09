import Database from './Database'
import { ObjectId } from 'mongodb'

interface UserData {
    id?: string,
    username: string,
    email: string,
    password?: string
}

const userModel = () => {

    const findOne = async (key: string, value: string, projection?: any) => {

        const query = (key === "_id") ? { _id: new ObjectId(value) } : { [key]: value }
        const _projection = projection ? { "projection": projection } : {}

            try {

                const result = Database.collection('users').findOne(query, _projection)

                return result


            } catch (err) {

                return err

            }

    }

    const create = async (userData: UserData) => {

        try {

            const result = await Database.collection('users').insertOne(userData)
            return result

        } catch (err) {

            return err

        }

    }

    const findOneAndUpdate = async (key: string, value: string, userData: UserData) => {

        const query = (key === "_id") ? { _id: new ObjectId(value) } : { [key]: value }

        try {
            
            const result = await Database.collection('users').findOneAndUpdate(
                query,
                { $set: userData },
                { upsert: true, returnOriginal: false }
            )
            return result

        } catch (err) {
            
            return err

        }

    }

    return {
        findOne,
        create,
        findOneAndUpdate
    }
}

const User = userModel()

export default User