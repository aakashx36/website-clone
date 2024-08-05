const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            author :'66b0bc280fde087caa041020',
                 geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            price  : 4000 ,
                      image: [
                {
                    
 url: 'https://res.cloudinary.com/dpge2tza3/image/upload/v1722868211/yelmap/o86buufbojy73ws2mdxd.jpg',
      filename: 'yelmap/o86buufbojy73ws2mdxd',

                },
                {
                    url: 'https://res.cloudinary.com/dpge2tza3/image/upload/v1722861731/yelmap/zgt0aivgkkaoamtyma1u.jpg',
      filename: 'yelmap/zgt0aivgkkaoamtyma1u',
                }
            ]
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})