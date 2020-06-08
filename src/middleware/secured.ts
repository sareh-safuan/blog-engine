
const secured = (req: any, res: any, next: any) => {

    if(!req.session.user) {
        req.flash('You need to login to view selected content')
        return res.redirect('/user')
    }
    next()

}

export default secured

