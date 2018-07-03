'use strict';

const _config = {};

/**
 * Main Config
 */
_config.core = {
    port: 3000,
    routes: ['match', 'route', 'nearest'],
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET',
        'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type, Accept',
        'Content-Type': 'application/json'
    },
    defaultResponseCode: 200,
    delimiter: ';',
    cache: true,
	mapAddress: 'Your .osrm file address'
};

/**
 * Redis Config
 */
_config.redis = {
    port: 6300,
    password: '',
    host: '127.0.0.1',
    dbindex: 1
};

/**
 * Route Parameters schema
 * @private
 */
_config._defaultOptions = {
    route: {
        alternatives: false,
        steps: false,
        annotations: false,
        geometries: 'polyline',
        overview: 'simplified',
        continue_straight: null
    },
    nearest: {
        number: 1
    },
    match: {
        steps: false,
        annotations: false,
        geometries: 'polyline',
        overview: 'simplified',
        timestamps: null,
        radiuses: null
    }
};

const Config = Object.freeze(_config);

module.exports = Config;