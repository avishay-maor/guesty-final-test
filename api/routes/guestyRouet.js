'use strict';
module.exports = function (app) {
    const controller = require('../controllers/guestyController');
    app.route('/generateListingsList')
        .get(controller.generateListingsList);
    app.route('/calculateOccupation')
        .get(controller.calculateOccupation);
    app.route('/getAllListings')
        .get(controller.getAllListings);
    app.route('/getOnlyDemandedListings')
        .get(controller.getOnlyDemandedListings);
    app.route('/showMap')
        .get(controller.showMap);
};
