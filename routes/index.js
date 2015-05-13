var express = require('express');
var router = express.Router();
var attask = require('../public/js/attask');
var drone = require('../public/js/drone');

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', {
		title : 'Express'
	});
});
router.get('/login', function(req, res, next) {
	attask.login(res);
});
router.get('/tasks', function(req, res, next) {
	attask.tasks(req.query.sessionID, res);
});
router.get('/complete', function(req, res, next) {
	attask.complete(req.query.sessionID, req.query.taskID, res);
});
router.get('/poll', function(req, res, next) {
	attask.poll(req.query.sessionID, req.query.taskID, res);
});
router.get('/launch', function(req, res, next) {
	drone.launch(req.query.taskID);
});
router.get('/stop', function(req, res, next) {
	drone.land();
});

module.exports = router;
