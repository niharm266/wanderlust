module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        //redirect URL save 
        req.session.redirectUrl=req.originalUrl
        req.flash("error","You are not logged in")
        return res.redirect("/login",)
    }
    next()
}
