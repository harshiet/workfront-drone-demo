var express = require('express');
var router = express.Router();
var attask = require('../public/js/attask');

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', {
		title : 'Express'
	});
});
router.get('/start', function(req, res, next) {
	attask.doProcess();
	res.send('Hello World!');
});

module.exports = router;
