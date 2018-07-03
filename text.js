'use strict';

const text = {};

text.error = {
    http: {
        400: 'invalid parameters supplied',
        405: 'Bad Request Method',
        404: 'Not Found'
    },
    app: {
        radius_timestamp: 'Timestamp OR Radius length not matched !',
        url: 'Invalid URL !',
        tokenMismatched: 'Token is Invalid!'
    }
};

module.exports = text;