'use strict';
const mongoose = require('mongoose'),
    Listing = mongoose.model('Listings'),
    airBnbHelper = require('../healpers/airbnbApiHelper'),
    path = require('path');


exports.getAllListings = function (req, res) {
    Listing.find({}, function (err, listing) {
        if (err) {
            res.send(err);
        }
        res.json(listing);
    });
};

exports.generateListingsList = function (req, res) {
    airBnbHelper.getAllListingsFromApi('paris', 0, [], res, 0, 10);
};

exports.calculateOccupation = function (req, res) {
    Listing.find({occupation: {$exists: false}}, function (err, listing) {
        if (err) {
            res.send(err);
        }
        airBnbHelper.calculateOccupation(listing);
    });
};

exports.getOnlyDemandedListings = function (req, res) {
    Listing.find({
        occupation: {$exists: true, $gte: 75},
        price: {$gte: 88},
        reviews_count: {$gte: 5},
        star_rating: {$gte: 4}
    }, function (err, listing) {
        if (err) {
            res.send(err);
        }
        res.json(listing);
    });
};
exports.showMap = function (req, res) {
    res.sendFile(path.join(__dirname + '/../../../index.html'));
};

