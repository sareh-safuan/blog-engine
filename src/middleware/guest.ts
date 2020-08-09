import { Request, Response, NextFunction } from '../utils/interface'

const guest = (req: Request, res: Response, next: NextFunction) => {
    if (req.session.user) {
        return res.redirect('/backoffice')
    }
    next()
}

export default guest