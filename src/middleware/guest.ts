
const guest = (req: any, res: any, next: any) => {

    if (req.session.user) {
        return res.redirect('/user')
    } else {
        next()
    }

}

export default guest