import { check, validationResult } from "express-validator"

export const createUser = (req: any, res: any, next: any) => {

    Promise.all([
        check('username', 'Invalid username')
            .isLength({ min: 5 }).run(req),
        check('email', 'Invalid email')
            .isEmail().run(req)
    ])
        .then(() => {
            redirectBadRequest(res, req, '/user/create')
            next()
        })

}

const redirectBadRequest = (res: any, req: any, redirectUrl: string, ) => {

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const msg = errors.array().map((err: any) => {
            return err.msg
        })

        req.session.flash = { ct: 0, msg: msg }
        res.redirect(redirectUrl)
    }

}