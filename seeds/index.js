const mongoose = require('mongoose');
const places = require('./places');
const { lastname, firstname } = require('./seedHelpers');
const Vendor = require('../models/vendor');
const image = require('./images');

mongoose.connect(process.env.DB_URL)
    .then(() => {
        console.log("Database connected succesfully!")
    })
    .catch((err) => {
        console.log("Failed to connect database!")
        console.log(err)
    })

const sample = array => array[Math.floor(Math.random() * array.length)];
function randRange(n) {
    const num1 = Math.floor(Math.random() * n);
    const num2 = Math.floor(Math.random() * n);
    if (num1 < num2) {
        return [num1, num2];
    }
    return [num2, num1];
}
function randTimeRange() {
    let startHour = Math.floor(Math.random() * 24) + 1;
    let endHour = Math.floor(Math.random() * 24) + 1;
    while ((endHour > startHour) !== true) {
        startHour = Math.floor(Math.random() * 24) + 1;
        endHour = Math.floor(Math.random() * 24) + 1;
    }
    const startMinute = Math.floor(Math.random() * 60) + 1;
    const endMinute = Math.floor(Math.random() * 60) + 1;
    return [`${startHour}:${startMinute}`, `${endHour}:${endMinute}`];
}
const seedDB = async () => {
    await Vendor.deleteMany({});
    for (let i = 0; i < 100; i++) {
        const [lowerPrice, upperPrice] = randRange(500);
        const [startTime, endTime] = randTimeRange();
        const firstimage = image[Math.floor(Math.random() * 20)];
        const lastimage = image[Math.floor(Math.random() * 20)];
        const randomLocation = places[Math.floor(Math.random() * 49)];
        const vendor = new Vendor({
            author: '65607268028cc84fe4f201d3',
            title: `${sample(firstname)} ${sample(lastname)}`,
            location: `${randomLocation.location}, Bhubaneswar`,
            pincode: randomLocation.pincode,
            geometry: {
                type: "Point",
                coordinates: [
                    randomLocation.lng,
                    randomLocation.lat
                ]
            },
            timings: {
                start: startTime,
                end: endTime
            },
            pricing: {
                from: lowerPrice,
                to: upperPrice
            },
            phoneno: Math.floor(Math.random() * (9999999999 - 1000000000 + 1)) + 1000000000,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore nihil voluptatem ducimus, asperiores rerum animi iste fugiat ipsam doloribus beatae non consectetur earum harum doloremque delectus minima qui, perspiciatis dicta.',
            images: [firstimage, lastimage]
        })
        await vendor.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close()
})