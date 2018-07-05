'use strict';

const Url = require('url');
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

    /**
     * Parses Url
     *
     * @param req
     * @param pathname
     * @returns {*}
     */
    static fetchUrl(req, pathname = false) {
        let url_parts = Url.parse(req.url, true);

        return ( pathname === true ) ? url_parts.pathname : url_parts.query;
    };
};