'use strict';

const Config = require('./config');

module.exports = class Router {

    /**
     * Check if the route params provided are valid.
     *
     * @param route
     * @returns {boolean}
     */
    static validateRoute (route) {
        let routeArray = route.split('/').filter(String);
        return routeArray.length === 1 && Config.core.routes.indexOf(routeArray[0]) !== -1;
    };
};