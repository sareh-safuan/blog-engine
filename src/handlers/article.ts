import express, { Request, Response } from 'express'
import slugify from 'slugify'
import ArticleModel from '../model/Article'
// import UserModel from '../model/User'

class ArticleController {
    async index(req: Request, res: Response) {
        const query = {}
        const sort = { publisheddate: -1 }
        const projection = {}
        const limit = 3

        try {
            const Article = new ArticleModel
            const articles = await Article.find(
                query, sort, projection, limit
            )

            res.render('index', {
                title: 'Homepage | smsafuan.com',
                index: true,
                articles
            })

        } catch (err) {
            console.log(err)
            res.end('error')
        }
    }
    
    create(req: Request, res: Response) {
        res.render('article_create', {
            title: 'smsafuan.com | Create an article.',
            index: false
        })
    }

    async store(req: Request, res: Response) {
        const { title, content } = req.body
        const slug = slugify(title, { lower: true })
        const author = 'Joana Higashikata'
        const publisheddate = new Date()

        try {
            const Article = new ArticleModel
            await Article.save({
                title, slug, content, author, publisheddate
            })

            res.redirect('/article/create')

        } catch (err) {
            throw err
        }
    }

    async show(req: Request, res: Response) {
        const { slug } = req.params

        try {
            const Article = new ArticleModel
            const article = await Article.detail('slug', slug)

            res.render('article_show', {
                title: article.title,
                index: false,
                article
            })

        } catch (err) {
            console.log(err.message)
            res.end('error')
        }
    }

    // edit, update, destroy
}

export default new ArticleController