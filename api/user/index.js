'use strict';

var express = require('express');
var controller = require('./user-controller');
const jwtHelper = require('../auth/jwt-helper');
var router = express.Router();

router.get('/getUserDetails', controller.getUserDetails);
router.post('/register', controller.register);
router.post('/userProfile', jwtHelper.verifyJwtToken, controller.userProfile);
module.exports = router;