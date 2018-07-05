'use strict';

const Http = require('http');
const Qs = require('querystring');

const App = require('./app');
const Config = require('./config');
const Router = require('./router');
const Response = require('./response');

module.exports = class Server {

    /**
     * Main Server. This is a http v1 server.
     */
    static httpV1() {
        Http.createServer( (req, res) => {
            let obj = new App(req, res);
            let route = Router.fetchUrl(req, true);

            if (!Router.validateRoute(route)) {
                Response.write(res, App.error(null, 400), 400);
                return false;
            }

            let method = route.split('/')[1].toLowerCase();

            if (req.method === 'POST') {
                let body = '';
                req.on('data', (chunk) => {
                    body += chunk;
                }).on('end', () => {
                    obj.initOSRM(method, Qs.parse(body));
                    return true;
                });

            } else if (req.method === 'GET') {
                let data = Router.fetchUrl(req, false);
                obj.initOSRM(method, data);
                return true;
            } else {
                Response.write(res, App.error(null, 405), 405);
                return false;
            }

        }).listen(Config.core.port);
    }

    /**
     * Main Server. This is a http v2 server.
     */
    static httpV2() {

    }

};