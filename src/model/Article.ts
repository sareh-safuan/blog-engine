import Database from './Database'
import { ObjectId } from 'mongodb'

interface ArticleData {
    title: string,
    article: string,
    authorid: string,
    slug: string
}

const articleModel = () => {

    const find = async (query: any, projection: any, limit: number) => {

        return Database
            .collection('articles')
            .find(query)
            .project(projection)
            .limit(limit)
            .toArray()

    }

    const findOne = (key: string, value: string) => {

        const query = (key === "_id") ? { _id: new ObjectId(value) } : { [key]: value }

        return Database
            .collection('articles')
            .findOne(query)

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