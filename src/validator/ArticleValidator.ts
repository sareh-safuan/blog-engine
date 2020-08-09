import { Request, Response, NextFunction } from '../utils/interface'
import { body, param } from 'express-validator'
import errorChecker from './errorChecker'

export const vCreateArticle = (req: Request, res: Response, next: NextFunction) => {
    Promise.all([
        body('title', 'Title cannot be empty')
            .not().isEmpty()
            .run(req),
        body('category', 'Please select category')
            .not().isEmpty()
            .run(req),
        body('content', 'Article content cannot be empty')
            .not().isEmpty()
            .run(req),
    ])
        .then(() => {
            const hasBadRequest = errorChecker(req)

            if (hasBadRequest) {
                return res.redirect('/backoffice/article/create')
            }
            next()
        })

}

export const fetchArticle = (req: any, res: any, next: any) => {
    param('id', 'Error fetching the article')
        .isMongoId()
        .run(req)
        .then(() => {
            const hasBadRequest = errorChecker(req)

            if (hasBadRequest) {
                return res.redirect('/article')
            }

            next()
        })
}

