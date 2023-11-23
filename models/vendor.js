const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

const imageSchema = new Schema({
    url: String,
    filename: String
})

imageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200')
})

imageSchema.virtual('indexImg').get(function () {
    return this.url.replace('/upload', '/upload/c_fill,g_center,ar_1:1')
})

imageSchema.virtual('showImg').get(function () {
    return this.url.replace('/upload', '/upload/c_fill,g_center,ar_4:3')
})

const vendorSchema = new Schema({
    title: String,
    location: String,
    pincode: Number,
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    timings: {
        start: String,
        end: String
    },
    pricing: {
        from: Number,
        to: Number
    },
    phoneno: Number,
    description: String,
    images: [imageSchema],
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }]
}, { toJSON: { virtuals: true } });

vendorSchema.virtual('properties.popupHTML').get(function () {
    return `<a href=/vendors/${this._id}>${this.title}</a>`
})

vendorSchema.post('findOneAndDelete', async function (data) {
    if (data) {
        await Review.deleteMany({
            _id: {
                $in: data.reviews
            }
        })
    }
})

module.exports = mongoose.model('Vendor', vendorSchema);

