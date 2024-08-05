if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}


const mongoSanitize = require('express-mongo-sanitize');
const express = require("express");
const app = express();
const flash = require("connect-flash")
const path = require("path")
const campground = require("./models/campground")
const mongoose = require("mongoose")
const ejsMate = require("ejs-mate")
const methodOverride = require("method-override")
const catchi = require('./utils/catch');
const ExpressError = require('./utils/ExpressError');
const Review = require("./review.js")
const allcamps = require("./routes/campground")
const reviews = require("./routes/review")
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/use');
const session = require('express-session');
const userRoutes = require('./routes/user');
const helmet = require('helmet');
const MongoDBStore = require("connect-mongo")(session);

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';
app.use(helmet());
const secret = process.env.SECRET || 'thisshouldbeabettersecret!';

const store = new MongoDBStore({
    url: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60
});

store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e)
})

const sessionConfig = {
    store,
    name : "session",
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dpge2tza3/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);
app.use(mongoSanitize());

app.use(session(sessionConfig))

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
        res.locals.currentUser = req.user;

    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.engine('ejs',ejsMate)
app.use(methodOverride('_method'))
app.use(express.urlencoded({extended : true}));
const Reviews = require("./review.js");
app.set("view engine","ejs"); 
app.set("views",path.join(__dirname,"/views")); 

app.use(express.static( path.join(__dirname, "public")))

app.use("/allcamp", allcamps)
app.use("/", userRoutes)

app.use("/allcamp/:id/reviews" , reviews)


mongoose.connect(dbUrl).then(() => {
	console.log('CONNECTING')

})
.catch((error) =>{
	console.log(error)

})

app.get("/" ,(req , res)=>{
res.render("index") ;})



app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})


app.listen( 3000 , ()=> {
console.log("listening");
});
