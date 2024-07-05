const express = require("express");
const router = express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const { listingSchema,reviewSchema }=require("../schema.js");
const {isLoggedIn} = require("../middleware.js");

const Listing= require('../models/listing.js');

const validateListing = (req,res,next) => {
    let {error}=listingSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else {
        next();
    }
};



router.get("/",wrapAsync( async (req,res) => {
    const allListings= await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}));
router.get("/new",isLoggedIn, (req,res) => {
    res.render("listings/new.ejs");
});

router.get("/:id", wrapAsync(async (req,res) => {
    let {id} = req.params;
    const listing= await Listing.findById(id).populate("reviews");
    if(!listing){
        req.flash("error", "not found");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
}));

router.post("/",isLoggedIn, validateListing,
    wrapAsync(async (req,res,next) => {


    const newListing =new Listing(req.body.listing);
   await newListing.save();
   req.flash("success", "created");
    res.redirect("/listings");
    })
);
router.get("/:id/edit",isLoggedIn, wrapAsync(async (req,res) => {
    let {id} = req.params;
    const listing= await Listing.findById(id);
    if(!listing){
        req.flash("error", "not found");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{listing});
}));

router.put("/:id",isLoggedIn, validateListing, wrapAsync(async (req,res) => {
    let {id} = req.params;
    const listing= await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success", "updated");
    res.redirect(`/listings/${id}`);
}));
router.delete("/:id",isLoggedIn, wrapAsync(async (req,res) => {
    let {id} = req.params;
    const deletedListing= await Listing.findByIdAndDelete(id);
    req.flash("success", "deleted");
    res.redirect("/listings");
}));

module.exports=router;