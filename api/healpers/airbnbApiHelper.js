/**
 * Created by avishaymaor on 04/07/2017.
 */
'use strict';
const mongoose = require('mongoose'),
    Listing = mongoose.model('Listings'),
    https = require('https'),
    airBnbHelper = require('../healpers/airbnbApiHelper');


exports.getAllListingsFromApi = function (city, offset, data, callback, min_price, max_price) {
    if (offset >= 1000 && max_price >= 1000) {
        console.log("Finished !");
        callback.send("Finished !");
        return true;
    } else if (offset >= 1000) {
        if (max_price <= 100) {
            max_price += 10;
        } else {
            max_price += 100;
        }
        if (min_price <= 100) {
            min_price += 10;
        }
        else {
            min_price += 100;
        }
        offset = 0;
    }
    getListingFromApi(city, offset, min_price, max_price).then(
        function (success) {
            addListingToDb(success.search_results);
            data = data.concat(success.search_results);
            offset += 50;
            airBnbHelper.getAllListingsFromApi(city, offset, data, callback, min_price, max_price);
        }, function (error) {
            console.log(error);
        })
};

const getListingFromApi = function (city, offset, min_price, max_price) {
    return new Promise((resolve, reject) => {
        const request_options =
            {
                host: 'api.airbnb.com',
                headers: {'user-agent': 'Mozilla/5.0'},
                path: '/v2/search_results?client_id=3092nxybyb0otqw18e8nh5nty&_limit=50&location=' + city + '&price_max=' + max_price + '&price_min=' + min_price
            };
        if (offset) {
            request_options.path += '&_offset=' + offset;
        }
        console.log(request_options.path);
        https.get(request_options, function (res) {
            if (res.statusCode === 200) {
                let body = '';
                res.on('data', function (d) {
                    body += d;
                });
                res.on('end', function () {
                    const parsed = JSON.parse(body);
                    resolve(parsed);
                });
            } else {
                reject('Error: ' + res.statusCode);
            }
        });

    })
};


const addListingToDb = function (data) {
    if (data.length) {
        for (let i in data) {
            data[i].listing.price = data[i].pricing_quote.localized_nightly_price;
            Listing.update(
                {id: data[i].listing.id},
                {$setOnInsert: data[i].listing},
                {upsert: true},
                function (err, numAffected) {
                    // console.log(numAffected);

                }
            );
        }
    }
};

exports.calculateOccupation = function (listings) {
    if (listings.length == 0) {
        return true
    }
    getOccupationScore(listings[0].id).then(function (success) {
            Listing.update(
                {id: success.id},
                {$set: {'occupation': success.score}},
                function (err, count) {
                    if (err) return console.log(err);
                });
            listings.shift();
            airBnbHelper.calculateOccupation(listings);
        }, function (error) {
            console.log(error);
        }
    );
};
const getOccupationScore = function (listing_id) {
    return new Promise((resolve, reject) => {
        const request_options =
            {
                host: 'api.airbnb.com',
                headers: {'user-agent': 'Mozilla/5.0'},
                path: '/v2/calendar_days?client_id=3092nxybyb0otqw18e8nh5nty&listing_id=' + listing_id
            };
        console.log(request_options.path);
        https.get(request_options, function (res) {
            if (res.statusCode === 200) {
                let body = '';
                res.on('data', function (d) {
                    body += d;
                });
                res.on('end', function () {
                    const parsed = JSON.parse(body);
                    let num_of_days_occupied = 0;
                    for (let j in parsed.calendar_days) {
                        if (!parsed.calendar_days[j].available) {
                            num_of_days_occupied++;
                        }
                    }
                    const score = num_of_days_occupied * 100 / parsed.calendar_days.length;
                    resolve({score: score, id: listing_id});
                });
            } else {
                reject('Error: ' + res.statusCode);
            }
        });

    })
};

