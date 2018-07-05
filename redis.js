'use strict';

const pRedis = require('redis');

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
        this.db = pRedis.createClient({
            host: Config.redis.host,
            port: Config.redis.port,
            password: Config.redis.password,
            retry_strategy: (options) => {
                if (options.error && options.attempt > 2) {
                    return false;
                }
            }
        });
        this.db.on('error', (err) => {
            return false;
        }).on('ready', () => {
            this.db.select(Config.redis.dbIndex);
        });
    }

    /**
     * Is the given key available?
     *
     * @param key
     * @param callback
     *
     * @returns {boolean}
     */
    /*is(key, callback) {
        this.checkAsync(key).then((result) => {
            callback(result);
        }).catch((err) => {
            callback(null);
            return false;
        });
    }*/

    /**
     * Fetch the given key.
     *
     * @param key
     */
    get(key) {
        return new Promise((resolve, reject) => {
            this.db.get(key, (err, reply) => {
                if( err || reply === null ) {
                    reject(null);
                } else {
                    this.db.quit();
                    resolve(reply);
                }
            });
        });
    }

    /**
     *
     * @param key
     * @param value
     * @param expiration Expiration Time Default is 1 Day = 86400 Seconds
     */
    set(key, value, expiration = undefined) {
        expiration = expiration !== undefined ? expiration : Config.core.cacheTime;
        this.db.set(key, value, 'EX', expiration);
        this.db.quit();
    }
};
