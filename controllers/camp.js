const campground = require('../models/campground');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAP_BOX;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require("../cloudinary");



module.exports.index = async (req , res)=>{
const camps= await campground.find({})
res.render("home",{camps})
}

module.exports.new =  async (req , res)=>{
res.render("new")
}

module.exports.render = async(req , res)=>{
  const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    const camp = new campground(req.body.campground);
    camp.image = req.files.map(f => ({ url: f.path, filename: f.filename }));
    camp.author = req.user._id;
        camp.geometry = geoData.body.features[0].geometry;

    await camp.save();
    console.log(camp)
        req.flash('success', 'Successfully made a new campground!');

    res.redirect("/allcamp")
}

module.exports.del = async (req , res)=>{
    const {id} = req.params;
 await campground.findByIdAndDelete(id);
     req.flash('success', 'Successfully deleted campground')
res.redirect("/allcamp")}

module.exports.show = async (req , res)=>{
const camp = await campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    console.log(camp);  if (!camp) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/allcamp');
    }
res.render("show", {camp})
}

module.exports.edit = async (req , res)=>{
    console.log(req.body)
   const {id} = req.params;
const camp = await campground.findByIdAndUpdate(id ,{...req.body.campground},{new:true});
const img = req.files.map(f => ({ url: f.path, filename: f.filename }))
camp.image.push(...img)
    await camp.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({ $pull: { image: { filename: { $in: req.body.deleteImages } } } })
    }

    req.flash('success', 'Successfully updated campground!');

res.redirect(`/allcamp/${id}`)}

module.exports.editrender = async (req , res)=>{
const camp= await campground.findById(req.params.id);
    if (!camp) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/allcamp');
    }
res.render("edit", {camp})
}