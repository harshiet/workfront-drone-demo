module.exports = {

	land : function() {
		console.log('landing');
		var arDrone = require('ar-drone');
		var client = arDrone.createClient({
			'ip' : '192.168.1.12'
		});
		client.ftrim()
		client.stop();
		client.land(function() {
			console.log('landed');
		});
		client.ftrim()
		// process.exit(0);
	},
	launch : function(taskID) {
		console.log(taskID);
		var arDrone = require('ar-drone');
		var client = arDrone.createClient({
			'ip' : '192.168.1.12'
		});
		var fs = require('fs'), df = require('dateformat');
		var upload = require('./upload-attask');

		var rotateAndTakePicture = function(index) {
			client.stop();
			// client.clockwise(.75);
			// client.back(.5);
			setTimeout(function() {
				client.stop();
				setTimeout(function() {
					// client.animateLeds('blinkOrange', 5, 2);
					client.getPngStream().once('data', function(data) {
						console.log('taking picture');
						var fileName = 'pano_' + index + '.png';
						fs.writeFile(fileName, data, function(err) {
							if (err) {
								console.log(err);
							} else {
								console.log(fileName + ' Saved');
								upload.uploadFile(fileName, taskID);
							}
						});
						if (index == 4) {
							land();
						} else {
							rotateAndTakePicture(index + 1);
						}
					});
				}, 2000);
			}, 1000);
		}
		var takeoffCallBack = function() {
			console.log('hovering');
			client.stop();
			setTimeout(function() {
				console.log('calibrating');
				client.calibrate(0);
				console.log('calibration done');
				setTimeout(function() {
					rotateAndTakePicture(1);
				}, 1000);
			}, 2000);
		}

		var land = function() {
			console.log('landing');
			client.land(function() {
				console.log('landed');
			});

		};

		client.ftrim();
		setTimeout(function() {
			console.log('taking off');
			client.takeoff(takeoffCallBack);
		}, 5000);

	}
}

return module.exports;
