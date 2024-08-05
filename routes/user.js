const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catch');
const users = require('../controllers/user');

const { storeReturnTo } = require('../middleware');

router.route("/register").get(users.register)
.post(catchAsync(users.registerp));



router.route("/login").get(users.logo)
.post(storeReturnTo,
passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}),
users.logp);




router.get('/logout',users.log )

module.exports = router;