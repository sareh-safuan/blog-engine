import Database from './Database'
import { ObjectId } from 'mongodb'

interface ArticleData {
    _id?: string,
    title: string,
    article: string,
    authorid: string,
    slug: string,
    publisheddate?: any
}

const articleModel = () => {

    const find = async (query: any, sort: any, projection: any, limit: number) => {

        return Database
            .collection('articles')
            .find(query)
            .sort(sort)
            .project(projection)
            .limit(limit)
            .toArray()

    }

    const findOne = async (key: string, value: string, projection?: any) => {

        const query = (key === "_id") ? { _id: new ObjectId(value) } : { [key]: value }
        const _projection = projection ? { "projection": projection } : {}

        return Database
            .collection('articles')
            .findOne(query, _projection)

    }

    const insertOne = async (articleData: ArticleData) => {
        
        return Database.collection('articles').insertOne({
            ...articleData,
            publisheddate: new Date()
        })

    }

    return {
        find,
        findOne,
        insertOne
    }

}

const Article = articleModel()

export default Article