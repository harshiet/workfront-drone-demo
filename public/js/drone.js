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
	launch : function(taskID, droneip, mystream) {
		console.log(taskID);
		var arDrone = require('ar-drone');
		var client = arDrone.createClient({
			'ip' : droneip
		});
		var pngStream = client.getPngStream();

		pngStream.on('error', console.log).on('data', function(pngBuffer) {
			mystream.png = pngBuffer;
		});
		var fs = require('fs'), df = require('dateformat');
		var upload = require('./upload-attask');

		var rotateAndTakePicture = function(index) {
//			if (index % 2 == 0) {
//				client.clockwise(.1);
//			} else {
//				client.clockwise(.1);
//			}
			setTimeout(function() {
				client.stop();
				client.animateLeds('blinkOrange', 5, 2);
				pngStream.once('data', function(data) {
					console.log('taking picture');
					var fileName = 'public/images/pano_' + index + '.png';
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
		}
		var takeoffCallBack = function() {
			console.log('hovering');
			client.stop();
			setTimeout(function() {
				console.log('calibrating');
				client.calibrate(0);
				console.log('calibration done');
				client.stop();
				setTimeout(function() {
					rotateAndTakePicture(1);
				}, 2000)

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
			// takeoffCallBack();
			client.takeoff(takeoffCallBack);
		}, 5000);
	},
	video : function(mystream, res) {
		res.writeHead(200, {
			'Content-Type' : 'image/png'
		});
		res.end(mystream.png);
	}
}

return module.exports;
