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

        return Database.collection('users').findOne(query, _projection)

    }

    const create = async (userData: UserData) => {

        return Database.collection('users').insertOne(userData)

    }

    const findOneAndUpdate = async (key: string, value: string, userData: UserData) => {

        const query = (key === "_id") ? { _id: new ObjectId(value) } : { [key]: value }

        return Database
            .collection('users')
            .findOneAndUpdate(
            query,
            { $set: userData },
            { upsert: true, returnOriginal: false }
        )

    }

    return {
        findOne,
        create,
        findOneAndUpdate
    }
}

const User = userModel()

export default User