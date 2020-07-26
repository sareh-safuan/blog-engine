import Database from './Database'
import { ObjectId } from 'mongodb'
import { query } from 'express-validator'

class BaseModel {

    _collection: string

    constructor(collectionName: string) {
        this._collection = collectionName
    }

    find(
        query: any,
        sort: any,
        projection: any,
        limit: number
    ) {
        return Database
            .collection(this._collection)
            .find(query)
            .sort(sort)
            .project(projection)
            .limit(limit)
            .toArray()
    }

    findOne(
        key: string,
        value: string,
        projection?: any
    ) {

        const query = (key === "_id") ? { _id: new ObjectId(value) } : { [key]: value }
        const _projection = projection ? { "projection": projection } : {}

        return Database
            .collection(this._collection)
            .findOne(query, _projection)
    }

    insertOne(docs: any) {
        return Database
            .collection(this._collection)
            .insertOne(docs)
    }

    updateOne(
        key: string,
        value: string,
        docs: any
    ) {
        const query = (key === "_id") ? { _id: new ObjectId(value) } : { [key]: value }

        return Database
            .collection(this._collection)
            .findOneAndUpdate(
                query,
                { $set: docs },
                { upsert: true, returnOriginal: false }
            )
    }

}

export default BaseModel