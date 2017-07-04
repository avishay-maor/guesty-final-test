'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ListingSchema = new Schema({
    id: Number,
    name: String,
    lat: Number,
    lng: Number,
    reviews_count: Number,
    star_rating: Number,
    city: String,
    price: Number,
    occupation: Number
});

module.exports = mongoose.model('Listings', ListingSchema);