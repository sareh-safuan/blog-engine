import express from 'express'
import slugify from 'slugify'
import { createArticle, fetchArticle } from '../validator/ArticleValidator'
import ArticleModel from '../model/Article'
import { ObjectId } from 'mongodb'
import UserModel from '../model/User'
import secured from '../middleware/secured'

const router = express.Router()

router.get(
    '/',
    async (req: any, res: any) => {

        const { lastId } = req.query
        const sort = { publisheddate: -1 }
        const projection = { authorid: 0, publisheddate: 0 }
        const limit = 5
        let query = {}
        let previousArticles = false

        try {

            if (lastId) {
                query = {
                    _id: { $lt: new ObjectId(lastId) }
                }
                previousArticles = true
            }

            const Article = new ArticleModel()
            const articles = await Article.find(query, sort, projection, limit)
            const nextArticles = (articles.length === limit) ? true : false

            res.render('at_index', {
                title: 'Home',
                flash: req.session.flash,
                user: req.session.user,
                articles,
                nextArticles,
                previousArticles
            })

        } catch (err) {

            req.flash('Error fetching articles. Please try again', false)
            res.render('at_index', {
                title: 'Home',
                flash: req.session.flash
            })

        }

    })

router.get(
    '/create',
    secured,
    (req: any, res: any) => {

        res.render('at_create', {
            title: 'Post an article',
            flash: req.session.flash,
            user: req.session.user
        })

    })

router.post(
    '/',
    [secured, createArticle],
    async (req: any, res: any) => {

        const { title, article } = req.body
        const authorid = req.session.user._id
        const slug = slugify(title)

        try {

            const Article = new ArticleModel()
            const result = await Article.insertOne({
                title,
                article,
                authorid,
                slug,
                publisheddate: new Date()
            })
            
            if (result.insertedCount !== 1) {
                throw new Error()
            }

            req.flash('Article successfully created')
            return res.redirect('/article/create')

        } catch (err) {

            req.flash('Oopss, something went wrong')
            return res.redirect('/article/create')

        }

    })

// router.get(
//     '/:id/edit',
//     (req: any, res: any) => {})

// router.post(
//     '/:id',
//     (req: any, res: any) => {})

router.get(
    '/:slug/:id',
    fetchArticle,
    async (req: any, res: any) => {

        const { id } = req.params

        try {

            const Article = new ArticleModel()
            const User = new UserModel()
            const article = await Article.findOne('_id', id)
            const author = await User.findOne('_id', article.authorid, { username: 1 })

            res.render('at_view', {
                title: article.title,
                user: req.session.user,
                article,
                author
            })


        } catch (err) {

            req.flash('Error fetching an article.')
            return res.redirect('/article')

        }

    })

export default router