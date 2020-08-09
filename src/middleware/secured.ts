import { Request, Response, NextFunction } from '../utils/interface'

const secured = (req: Request, res: Response, next: NextFunction) => {
    if(!req.session.user) {
        if(req.setFlash) {
            req.setFlash('You need to login to view selected content.')
        }
        return res.redirect('/login')
    }
    next()

}

export default secured

