import { body, param } from 'express-validator'
import errorHandler from './errorHandler'

export const createArticle = (req: any, res: any, next: any) => {

    Promise.all([
        body('title', 'Title cannot be empty')
            .not().isEmpty()
            .run(req),

        body('article', 'Article content cannot be empty')
            .not().isEmpty()
            .run(req),
    ])
        .then(() => {
            const hasBadRequest = errorHandler(req)

            if (hasBadRequest) {
                return res.redirect('/article/create')
            }
            next()
        })

}

export const fetchArticle = (req: any, res: any, next: any) => {

    param('id', 'Error fetching the article')
        .isMongoId()
        .run(req)
        .then(() => {
            const hasBadRequest = errorHandler(req)

            if (hasBadRequest) {
                return res.redirect('/article')
            }

            next()
        })

}

