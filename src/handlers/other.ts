import { Request, Response } from '../utils/interface'

class Other {
    home(req: Request, res: Response) {
        res.redirect('/article')
    }

    error(req: Request, res: Response) {
        res.status(500).render('error', {
            title: 'Server error | smsafuan.com'
        })
    }

    notFound(req: Request, res: Response) {
        res.status(404).render('not_found', {
            title: 'Not found | smsafuan.com'
        })
    }

    dashboard(req: Request, res: Response) {
        res.render('dashboard', {
            title: 'Dashboard | smsafuan.com'
        })
    }
}

export default new Other