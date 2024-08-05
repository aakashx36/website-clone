 const User = require('../models/use');



 module.exports.log = (req, res) => {
	 req.logout(function (err) {
        if (err) {
            return next(err);
        }
    req.flash('success', "Goodbye!");
    res.redirect('/allcamp');
})}

 module.exports.logp =      (req, res) => {
        req.flash('success', 'Welcome back!');
        const redirectUrl = res.locals.returnTo || '/allcamp'; // update this line to use res.locals.returnTo now
        res.redirect(redirectUrl);
    }

    module.exports.registerp = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Yelp Camp!');
            res.redirect('/allcamp');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
}
module.exports.register =  (req, res) => {
    res.render('user/register');
}
module.exports.logo = (req, res) => {
    res.render('user/login');
}