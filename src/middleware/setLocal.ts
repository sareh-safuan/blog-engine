import { Request, Response, NextFunction } from '../utils/interface'

function setLocal(req: Request, res: Response, next: NextFunction) {
    res.locals.index = false
    res.locals.flash = req.getFlash ? req.getFlash() : false
    res.locals.isLogin = req.session.user ? true : false

    next()
}

export default setLocal