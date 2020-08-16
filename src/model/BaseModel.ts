import Database from './Database'
import { ObjectId } from 'mongodb'
import { ArticleSave, UserSave, UserUpdatePassword, ArticleUpdate }
    from '../utils/interface'

class BaseModel {

    _collection: string

    constructor(collectionName: string) {
        this._collection = collectionName
    }

    find(
        query: any,
        skip: number,
        sort: any,
        projection: any,
        limit: number
    ) {
        return Database()
            .collection(this._collection)
            .find(query)
            .skip(skip)
            .sort(sort)
            .project(projection)
            .limit(limit)
            .toArray()
    }

    detail(key: string, value: string, projection?: any) {
        const query = (key === "_id") ? { _id: new ObjectId(value) } : { [key]: value }
        const _projection = projection ? { "projection": projection } : {}

        return Database()
            .collection(this._collection)
            .findOne(query, _projection)
    }

    save(docs: ArticleSave | UserSave) {
        return Database()
            .collection(this._collection)
            .insertOne(docs)
    }

    update(_id: string, docs: UserUpdatePassword | ArticleUpdate) {
        const query = { _id: new ObjectId(_id) }

        return Database()
            .collection(this._collection)
            .findOneAndUpdate(
                query,
                { $set: docs },
                { upsert: true, returnOriginal: false }
            )
    }

    count() {
        return Database()
            .collection(this._collection)
            .countDocuments()
    }

}

export default BaseModel