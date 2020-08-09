import { Request, Response } from '../utils/interface'
import slugify from 'slugify'
import ArticleModel from '../model/Article'
import { errorLogger } from '../utils/logger'
import errorHandler from '../utils/errorHandler'

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
            const { method, url } = req
            const { message } = err
            errorLogger(method, url, message)
            return res.redirect('/error')
        }
    }

    create(req: Request, res: Response) {
        res.render('article_create', {
            title: 'smsafuan.com | Create an article.',
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
            const title = article.title + '| edit'

            res.render('article_edit', {
                title: title,
                index: false,
                article
            })
        } catch (err) {
            const { method, url } = req
            const { message } = err
            res
                .status(500)
                .render('error', errorHandler(method, url, message))
        }
    }

    // update, destroy
}

export default new ArticleController