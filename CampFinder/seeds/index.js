const User = require('../models/user');
const mongoose = require('mongoose');
const Campground = require('../models/campground');
let cities = require('./cities');


const { places, descriptors } = require('./seedhelpers');


mongoose.connect('mongodb://127.0.0.1:27017/camp-finder', {
    useNewUrlParser: true,
    autoIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    await User.deleteMany({});

    const user = new User({ email: 'johndoe@gmail.com', username: 'JohnShmoe' });
    await User.register(user, '1234');
    user.save();


    for (let i = 0; i < 100; i++) {
        let random1000 = Math.floor(Math.random() * (1000));
        while (cities[random1000] === undefined) {
            random1000 = Math.floor(Math.random() * (1000));
        }
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: user._id,
            location: `${cities[random1000].city}, ${cities[random1000].state}`
            , title: `${sample(descriptors)} ${sample(places)}`
            , description: 'It is a camp.......bye'
            , price
            , geometry: {
                type: "Point",
                coordinates: [cities[random1000].longitude, cities[random1000].latitude]
            }
            , images: [
                {
                    url: 'Add your cloudinary image url here',
                    filename: 'Add your image file name and route Ex: CampFinder/my-first-image',
                },
                {
                    url: 'Add your cloudinary image url here',
                    filename: 'Add your image file name and route Ex: CampFinder/my-first-image',
                }
            ]
        });
        await camp.save();
        delete cities[random1000];

    }


}

seedDB().then(() => {
    mongoose.connection.close();
});