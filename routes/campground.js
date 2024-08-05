const express = require('express');
const router = express.Router();
const catchi = require('../utils/catch');
const { campgroundSchema } = require('../schema.js');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');

const ExpressError = require('../utils/ExpressError');
const campgrounds = require('../controllers/camp');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({storage});

router.route("/")
.get(isLoggedIn ,catchi(campgrounds.index))
.post(isLoggedIn,upload.array("image"),validateCampground,catchi(campgrounds.render))



router.get("/new" , isLoggedIn , campgrounds.new)

router.route("/:id").get( isLoggedIn,catchi(campgrounds.show))
.put(isLoggedIn,upload.array("image"), isAuthor, catchi(campgrounds.edit))
.delete( isAuthor,isLoggedIn ,catchi(campgrounds.del))




router.get("/:id/edit",isLoggedIn,isAuthor , campgrounds.editrender)




module.exports = router;