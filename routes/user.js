const express=require("express")
const router=express.Router()
 const User=require("../models/user.js")
const wrapAsync=require("../utils/wrapAsync.js")
const passport=require("passport")
// const {saveRedirectUrl}=require("../middleware.js")


router.get("/signup", (req,res) => {
    res.render("users/signup.ejs"); 
});


router.post("/signup",wrapAsync(async(req,res)=>{
    try{
        let {username,email,password}=req.body;
        const newUser=new User({email,username});
        const registeredUser=await User.register(newUser,password);
        console.log(registeredUser);
        // req.login(registeredUser,(err)=>{
        //     if(err){
        //         return next(err)
        //     }
           req.flash("success","User is registered successfully")
           res.redirect("/listings")
        // })
    }
    catch(e){
        req.flash("error",e.message)
        res.redirect("/signup")
    }

}
));

router.get("/login", (req,res) => {
    res.render("users/login.ejs"); 
});
router.post(
    "/login", 
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash:true,
    }),
    async (req,res) => {
    req.flash("success","logged in");
    res.redirect("/listings");
});



module.exports=router;