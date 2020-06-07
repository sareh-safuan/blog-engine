
const secured = (req: any, res: any, next: any) => {

    if(!req.session.user) {
        req.session.flash = {
            ct: 0,
            msg: 'You need to login to view selected content'
        }
        return res.redirect('/user')
    } else {
        next()
    }

}

export default secured

