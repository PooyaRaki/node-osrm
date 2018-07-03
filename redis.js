'use strict';

const pRedis = require('redis');
const util = require('util');

const Config = require('./config');

/**
 * Redis class.
 *
 * @type {Redis}
 */
module.exports = class Redis {
    /**
     * Initialize a new redis connection.
     */
    constructor() {
        if( Config.core.cache === true ) {
            this.db = pRedis.createClient({
                host: Config.redis.host,
                port: Config.redis.port,
                password: Config.redis.password
            });
            this.db.on('error', () => {
                return false;
            });
            this.db.select(0);
            this.getAsync = util.promisify(this.db.get).bind(this.db);
            this.checkAsync = util.promisify(this.db.exists).bind(this.db);
        }
    }

    /**
     * Is the given key available?
     *
     * @param key
     * @param callback
     *
     * @returns {boolean}
     */
    is(key, callback) {

        if( Config.core.cache === false ) {
            callback(null);

            return false;
        }

        this.checkAsync(key).then( (result) => {
            callback(result);
        }).catch( (err) => {
            return false;
        } );
    }

    /**
     * Fetch the given key.
     *
     * @param key
     * @param callback
     */
    fetch(key, callback) {
        if( Config.core.cache === false ) {
            callback(null);

            return false;
        }

        this.getAsync(key).then( (result) => {
            callback(result, undefined);
        }).catch( (err) => {
            return false;
        });
    }

    /**
     *
     * @param key
     * @param value
     * @param expiration Expiration Time Default is 1 Day = 86400 Seconds
     */
    writeCache(key, value, expiration = 86400) {
        if( Config.core.cache === false ) {

            return false;
        }

        let result = this.db.setex(key, expiration, value);
        this.db.quit();
        return result;
    }
};
