/**
 * Main application routes
 */

'use strict';
/*var _ = require('lodash');*/


module.exports = function (app) {
    app.use('/api/user', require('./api/user'));
    app.use('/api/auth', require('./api/auth'));
};