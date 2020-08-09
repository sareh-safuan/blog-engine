import { Request, Response, NextFunction } 
    from '../utils/interface'

function flashyFlash(req: Request, res: Response, next: NextFunction) {
    req.setFlash = (msg: string | Array<string>, redirect = true) => {
        const ct = redirect ? 0 : 1
        req.session.flash = {
            ct,
            msg
        }
    }

    req.getFlash = () => {
        if (req.session.flash) {
            return req.session.flash.msg
        }

        return false
    }

    if (req.session.flash) {
        if (req.session.flash.ct) {
            req.session.flash = undefined
        } else {
            req.session.flash.ct++
        }
    }

    next()
}

export default flashyFlash