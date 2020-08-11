import { Request, Response } from '../utils/interface'
import slugify from 'slugify'
import ArticleModel from '../model/Article'
import { errorLogger } from '../utils/logger'

class ArticleController {
    async index(req: Request, res: Response) {
        const page: any = req.query.page || 1
        const projection = { author: 0, content: 0 }
        const limit = 10
        const query = {}
        const sort = { publisheddate: -1 }
        const skip = page !== 1 ? (page - 1) * limit : 0

        try {
            const Article = new ArticleModel
            const articles = await Article.find(
                query, skip, sort, projection, limit
            )
            const back = page > 1 ? page - 1 : false
            const next = articles.length === limit ? +page + 1 : false

            res.render('index', {
                title: 'Homepage',
                index: true,
                articles,
                back,
                next
            })

        } catch (err) {
            const { method, url } = req
            const { message } = err
            errorLogger(method, url, message)
            return res.redirect('/error')
        }
    }

    create(req: Request, res: Response) {
        res.render('article_create', {
            title: 'Create an article',
            index: false
        })
    }

    async store(req: Request, res: Response) {
        const { title, category, content } = req.body
        const slug = slugify(title, { lower: true })
        const author = req.session.user._id
        const publisheddate = new Date()

        try {
            const Article = new ArticleModel
            await Article.save({
                title, slug, category, content, author, publisheddate
            })

            if (req.setFlash) {
                req.setFlash(':ok|Article created.')
            }

            res.redirect('/backoffice/article/create')

        } catch (err) {
            const { method, url } = req
            const { message } = err
            errorLogger(method, url, message)
            return res.redirect('/error')
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
            const { method, url } = req
            const { message } = err
            errorLogger(method, url, message)
            return res.redirect('/error')
        }
    }

    async edit(req: Request, res: Response) {
        const { id } = req.params

        try {
            const Article = new ArticleModel
            const article = await Article.detail('_id', id)
            const title = article.title

            res.render('article_edit', {
                title,
                article
            })
        } catch (err) {
            const { method, url } = req
            const { message } = err
            errorLogger(method, url, message)
            return res.redirect('/error')
        }
    }

    async update(req: Request, res: Response) {
        const { title, category, content } = req.body
        const { id } = req.params
        const updatedate = new Date()

        try {
            const Article = new ArticleModel()
            await Article.update(id, {
                title,
                category,
                content,
                updatedate
            })

            if (req.setFlash) {
                req.setFlash(':ok|Article updated.')
            }

            res.redirect('/backoffice/article/' + id + '/edit')
        } catch (err) {
            const { method, url } = req
            const { message } = err
            errorLogger(method, url, message)
            return res.redirect('/error')
        }
    }

    async destroy(req: Request, res: Response) {
        
    }
}

export default new ArticleController