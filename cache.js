'use strict';

const Redis = require('./redis');
const Config = require('./config');

const classesMapping = {
    'redis': Redis
};

module.exports = class Cache {
    constructor() {
        this.status = Config.core.cache;
        if( this.status ) {
            this.engine = new classesMapping[Config.core.cacheEngine];
        }
    }

    status() {
        return this.status;
    }

    get(key, callback) {
        if (this.status && key) {
            this.engine.get(key)
                .then((result) => {
                    callback(result);
                }).catch((err) => {
                    callback(undefined);
                });
        } else {
            callback(undefined);
        }
    }

    set(key, value, expiration = undefined) {
        if( this.status && key && value ) {
            this.engine.set(key, value, expiration);
        }
    }
};