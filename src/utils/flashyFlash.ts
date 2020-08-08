function flashyFlash(req: any, res: any, next: any) {
    req.flash = (msg: string | Array<string>, redirect = true) => {
        const ct = redirect ? 0 : 1
        req.session.flash = {
            ct,
            msg
        }
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