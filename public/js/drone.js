module.exports = {

	launch : function() {
		console.log('inside launch');
		var arDrone = require('ar-drone');
		var client = arDrone.createClient({'ip': '192.168.1.12'});
		console.log('inside launch1');
		var fs = require('fs'), df = require('dateformat');
		var rotateAndTakePicture = function(index) {
			client.stop();
			client.clockwise(.75);
			// client.back(.5);
			setTimeout(function() {
				client.stop();
				setTimeout(function() {
					client.animateLeds('blinkOrange', 5, 2);
					client.getPngStream().once('data', function(data) {
						console.log('taking picture');
						var fileName = 'pano_' + index + '.png';
						fs.writeFile(fileName, data, function(err) {
							if (err) {
								console.log(err);
							} else {
								console.log(fileName + ' Saved');
							}
						});
						if (index == 4) {
							client.land(function() {
								console.log('landing');
								process.exit(0);
							})
						} else {
							rotateAndTakePicture(index + 1);
						}
					});
				}, 2000);
			}, 1000);
		}
		var takeoffCallBack = function() {
			console.log('hovering');
			// console.log('calibrating');
			// client.calibrate(0);
			// console.log('calibration done');
			client.stop();
			setTimeout(function() {
				rotateAndTakePicture(1);
			}, 500);
		}

		client.ftrim()
		console.log('inside launch2');

		setTimeout(function() {
			console.log('taking off');
			client.takeoff(takeoffCallBack);
			takeoffCallBack();
		}, 2000);

	}
}

return module.exports;
