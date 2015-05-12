var express = require('express');
var router = express.Router();
var attask = require('../public/js/attask');

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', {
		title : 'Express'
	});
});
router.get('/login', function(req, res, next) {
	attask.login(res);
});
router.get('/login', function(req, res, next) {
	attask.login(res);
});
router.get('/login', function(req, res, next) {
	attask.login(res);
});
router.get('/login', function(req, res, next) {
	attask.login(res);
});

module.exports = router;
