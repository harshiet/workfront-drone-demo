var doProcess = function() {
	process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0
	var http = require('https');
	var sessionID = '';

	var options = {
		host : 'pharmaref1.attask-ondemand.com',
		// port : 443,
		path : '/attask/api/login?username=harsh.agarwal@aurotechcorp.com&password=Aurotech12',
		method : 'GET'
	};

	http.request(options, function(res) {
		res.setEncoding('utf8');
		res.on('data', function(chunk) {
			var json = JSON.parse(chunk);
			sessionID = json.data.sessionID;
			upload();
		});
	}).end();

	var upload = function() {
		var request = require('request');
		var fs = require('fs');
		var req = request.post('https://pharmaref1.attask-ondemand.com/attask/api/upload?sessionID=' + sessionID, function(err, resp, body) {
			if (err) {
				console.log(body);
			} else {
				console.log('URL: ' + body);
			}
		});
		var form = req.form();
		form.append('uploadedFile', fs.createReadStream('pano_.png'));
//		var options = {
//			host : 'pharmaref1.attask-ondemand.com',
//			path : 'https://pharmaref1.attask-ondemand.com/attask/api/upload?sessionID=' + sessionID,
//			method : 'POST',
//			contentType : false,
//			processData : false
//		};
//		var handle = '';
//		http.request(options, function(res) {
//			res.setEncoding('utf8');
//			res.on('data', function(chunk) {
//				handle += chunk;
//			});
//
//			res.on('end', function() {
//				console.log('handle: ' + handle);
//				uploadFile(handle);
//			})
//		}).end();
	}

	var uploadFile = function(handle) {
		var updates = {
			name : 'a',
			handle : handle,
			docObjCode : 'TASK',
			objID : '55511c1c0007225e872c01cd7dff715c',
			currentVersion : {
				version : 'v1.0',
				fileName : 'a'
			}
		}
		var options = {
			host : 'pharmaref1.attask-ondemand.com',
			path : 'https://pharmaref1.attask-ondemand.com/attask/api/document?updates=' + JSON.stringify(updates) + '&sessionID=' + sessionID,
			method : 'POST'
		};
		http.request(options, function(res) {
			res.setEncoding('utf8');
			res.on('data', function(chunk) {
				console.log(chunk);
			});
		}).end();

	}
}
doProcess();
