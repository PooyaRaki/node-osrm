'use strict';

const OSRMObj = require('osrm');
const Crypt = require('crypto');

const text = require('./text');
const Cache = require('./cache');
const Config = require('./config');
const Response = require('./response');
const OSRM = new OSRMObj(Config.core.mapAddress);

/**
 * Main Class.
 *
 * @type {App}
 */
module.exports = class App {
    /**
     * Application Constructor
     * @param request
     * @param server
     */
    constructor(request, server) {
        this._coordinate = [];
        this._timestamp = [];
        this._radius = [];
        this.server = server;
        this.token = App.generateToken(request.url);
    }

    /**
     * Is variable set ?
     * @param variable
     * @returns {boolean}
     */
    static is(variable) {
        return ( variable !== undefined );
    };

    /**
     * It makes error ready to be written in the response
     *
     * @param error
     * @param code
     */
    static error(error, code = undefined) {
        if (error === null && code !== undefined && text.error.http[code] !== undefined)
            error = text.error.http[code];

        return Response.make({'status': error});
    };

    /**
     * Generates A token for the application based on the request parameters.
     *
     * @param request
     * @returns {*}
     */
    static generateToken(request) {
        return Crypt.createHash('sha1').update(request, 'binary').digest('hex');
    }

    /**
     * It pushes Coordinates and other related stuff into their own variable.
     *
     * @param method
     * @param data
     * @returns {boolean}
     */
    fetchPointsOptions(method, data) {
        if (data.coordinates === undefined)
            return false;

        let coordinateArr = data.coordinates.split(Config.core.delimiter);
        let timestampArr = ( data.timestamps !== undefined ) ? data.timestamps.split(Config.core.delimiter) : undefined;
        let radiusArr = ( data.radiuses !== undefined ) ? data.radiuses.split(Config.core.delimiter) : undefined;
        let length = coordinateArr.length;

        for (let i = 0; length > i; i++) {
            let latLng = coordinateArr[i].split(',');

            if (method === 'match' || method === 'nearest')
                this._coordinate.push([parseFloat(latLng[1]), parseFloat(latLng[0])]);
            else if (method === 'route')
                this._coordinate.push([parseFloat(latLng[0]), parseFloat(latLng[1])]);

            if (timestampArr && timestampArr[i]) {
                if (timestampArr.length === length) {
                    this._timestamp.push(parseInt(timestampArr[i]));
                } else {
                    this._timestamp = -1;
                }
            }

            if (radiusArr && radiusArr[i]) {
                if (radiusArr.length === length) {
                    this._radius.push(parseFloat(radiusArr[i]));
                } else {
                    this._radius = -1;
                }
            }
        }
    };

    /**
     * Makes options array ready to be sent to the API.
     *
     * @param query
     * @returns {{}}
     */
    setOptions(query) {
        let options = {};
        options.coordinates = this._coordinate;

        if (this._timestamp.length > 0)
            options.timestamps = this._timestamp;

        if (this._radius.length > 0)
            options.radiuses = this._radius;

        if (App.is(query.overview))
            options.overview = query.overview;
        if (App.is(query.geometries))
            options.geometries = query.geometries;
        if (App.is(query.annotations))
            options.annotations = query.annotations;
        if (App.is(query.steps))
            options.steps = Boolean(query.steps);
        if (App.is(query.alternateRoute))
            options.alternateRoute = query.alternateRoute;

        if (App.is(query.number))
            options.number = query.number;

        return options;
    };

    /**
     * Is caching enabled ?
     *
     * @returns {boolean}
     */
    static isCache() {
        return Config.core.cache === true;
    }

    /**
     * Initialize a new OSRM session.
     *
     * @param method
     * @param data
     * @returns {boolean}
     */
    initOSRM(method, data) {
        let cacheServer = new Cache;
        cacheServer.get(this.token, (result) => {
            if (result) {
                Response.write(this.server, result, undefined, {
                    'Content-Length': Buffer.byteLength(result)
                });
            } else {
                //Shared Variables
                this.fetchPointsOptions(method, data);
                if (this._coordinate.length < 2) {
                    Response.write(this.server, App.error(text.error.http[400]), 400);
                    return false;
                }

                if (this._timestamp === -1 || this._radius === -1) {
                    Response.write(this.server, App.error(text.error.app.radius_timestamp), 400);
                    return false;
                }

                let options = this.setOptions(data);
                //Shared Variables

                //Callback

                /**
                 * The callback to use in OSRM Api.
                 *
                 * @param err
                 * @param result
                 * @returns {boolean}
                 */
                let osrmCallback = (err, result) => {
                    if (err) {
                        Response.write(this.server, App.error(err.message));
                        return false;
                    }

                    /*if (data.process)
                        result = Response.manipulate(method, result);*/

                    let resp = Response.make(result);
                    cacheServer.set(this.token, resp);
                    Response.write(this.server, resp, undefined, {
                        'Content-Length': Buffer.byteLength(resp)
                    });
                    return true;
                };

                //Callback
                if (method === 'match') {
                    OSRM.match(options, osrmCallback);
                } else if (method === 'route') {
                    OSRM.route(options, osrmCallback);
                } else if (method === 'nearest') {
                    OSRM.nearest(options, osrmCallback);
                }
            }
        });
    };
};