'use strict';

const Config = require('./config');

/**
 * Response Class
 *
 */
module.exports = class Response {
    /**
     * Makes response ready to be written in the response
     *
     * @param response
     */
    static make(response) {
        return JSON.stringify(response);
    };

    /**
     * Sets Response Headers
     *
     * @param server
     * @param code
     */
    static setHeader(server, code = undefined) {
        code = ( code !== undefined ) ? code : Config.core.defaultResponseCode;
        server.writeHead(code, Config.core.headers);
    };

    /**
     * Write response and set response headers
     *
     * @param server
     * @param result
     * @param code
     * @param extraHeads
     */
    static write(server, result, code = undefined, extraHeads = undefined) {
        if (extraHeads !== undefined) {
            Object.keys(extraHeads).forEach(function (key) {
                server.setHeader(key, extraHeads[key]);
            });
        }
        Response.setHeader(server, code);
        server.write(result);
        server.end(); //end the response
    };

    static manipulate(method, result) {
        if( Config.core.routes.indexOf(method) !== -1 ) {
            return Response[method](result);
        }

        return [];
    }

    static match(result) {
        // console.log(result);
    }
};