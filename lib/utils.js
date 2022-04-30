checkAuthenticated = (req, res, next)=>{
    if(req.isAuthenticated()){
        console.log(`value of isAuth is ${req.isAuthenticated}`)
        return next()
    }
    res.redirect('/user/login')
}

protectLoginRoute=(req, res, next)=>{
    if(req.isAuthenticated()){
        res.redirect('/user/dashboard')
    }
    return next()
}

module.exports.chkAuthenticated = checkAuthenticated
module.exports.prtLoginRoute = protectLoginRoute