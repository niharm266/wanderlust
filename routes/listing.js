const express = require("express");
const router = express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const Listing=require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");






router.get("/",wrapAsync( async (req,res) => {
    const allListings= await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}));
router.get("/new",isLoggedIn, (req,res) => {
    res.render("listings/new.ejs");
});

router.get("/:id", wrapAsync(async (req,res) => {
    let {id} = req.params;
    const listing= await Listing.findById(id).populate("reviews").populate("owner");
    if(!listing){
        req.flash("error", "not found");
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs",{listing});
}));

router.post("/",isLoggedIn, validateListing,
    wrapAsync(async (req,res,next) => {


    const newListing =new Listing(req.body.listing);
    newListing.owner=req.user._id;
   await newListing.save();
   req.flash("success", "created");
    res.redirect("/listings");
    })
);
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(async (req,res) => {
    let {id} = req.params;
    const listing= await Listing.findById(id);
    if(!listing){
        req.flash("error", "not found");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{listing});
}));

router.put("/:id",isLoggedIn, isOwner,validateListing, wrapAsync(async (req,res) => {
    let {id} = req.params;
    const listing= await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success", "updated");
    res.redirect(`/listings/${id}`);
}));
router.delete("/:id",isLoggedIn, isOwner,wrapAsync(async (req,res) => {
    let {id} = req.params;
    const deletedListing= await Listing.findByIdAndDelete(id);
    req.flash("success", "deleted");
    res.redirect("/listings");
}));

module.exports=router;