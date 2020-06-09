import express from 'express'
import slugify from 'slugify'
import { createArticle } from '../validator/ArticleValidator'
import Article from '../model/Article'
import { ObjectId } from 'mongodb'
import User from '../model/User'

const router = express.Router()

router.get(
    '/',
    async (req: any, res: any) => {

        const { lastId } = req.query
        const sort = { publisheddate: -1 }
        const projection = { article: 0 }
        const limit = 5
        let query = {}
        let previousArticles = false

        if (lastId) {
            query = {
                _id: { $lt: new ObjectId(lastId) }
            }
            previousArticles = true
        }

        try {

            const articles = await Article.find(query, sort, projection, limit)
            const nextArticles = (articles.length === limit) ? true : false

            res.render('at_index', {
                title: 'Home',
                flash: req.session.flash,
                articles,
                nextArticles,
                previousArticles
            })

        } catch (err) {

            req.flash('Error fetching articles. Please try again')
            res.render('at_index', {
                title: 'Home',
                flash: req.session.flash
            })

        }

    })

router.get(
    '/create',
    (req: any, res: any) => {

        res.render('at_create', {
            title: 'Post an article',
            flash: req.session.flash
        })

    })

router.post(
    '/',
    createArticle,
    async (req: any, res: any) => {

        const { title, article } = req.body
        const authorid = "5ed9a680bc179f0d40871a7c" || req.session.user._id
        const slug = slugify(title)

        try {

            const result = await Article.insertOne({ title, article, authorid, slug })
            if (result.insertedCount !== 1) {
                throw new Error()
                // result.insertedId -> new article id inserted
            }

            req.flash('Article successfully created')
            return res.redirect('/article/create')

        } catch (err) {

            req.flash('Oopss, something went wrong')
            return res.redirect('/article/create')

        }

    })

router.get(
    '/:id/edit',
    (req: any, res: any) => { })

router.post(
    '/:id',
    (req: any, res: any) => { })

router.get(
    '/:slug/:id',
    async (req: any, res: any) => {

        const { id } = req.params

        try {
            
            const article = await Article.findOne('_id', id)
            const author = await User.findOne('_id', article.authorid, { username: 1 })

            res.render('at_view', {
                title: article.title,
                article,
                author
            })
            

        } catch (err) {

            req.flash('Error fetching an article.')
            return res.redirect('/article')

        }

    })

export default router