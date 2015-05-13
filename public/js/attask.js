module.exports = {
	login : function(response) {
		console.log('login');
		process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0
		var http = require('https');
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
				response.send(json.data.sessionID);
			});
		}).end();
	},

	tasks : function(sessionID, response) {
		process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0
		var http = require('https');
		var predicateBy = function(prop) {
			return function(a, b) {
				if (a[prop] > b[prop]) {
					return 1;
				} else if (a[prop] < b[prop]) {
					return -1;
				}
				return 0;
			}
		}

		var options = {
			host : 'pharmaref1.attask-ondemand.com',
			// port : 443,
			path : 'https://pharmaref1.attask-ondemand.com/attask/api/project/search?fields=tasks:name,tasks:status,tasks:taskNumber&name=Drone%20Launch&sessionID=' + sessionID,
			method : 'GET'
		};
		var str = '';
		http.request(options, function(res) {
			res.setEncoding('utf8');
			res.on('data', function(chunk) {
				str += chunk;
			});

			res.on('end', function() {
				var json = JSON.parse(str);
				var tasks = json.data[0].tasks;
				tasks.sort(predicateBy('taskNumber'));
				response.send(tasks);
			})
		}).end();
	},

	poll : function(sessionID, taskID, response) {
		process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0
		var http = require('https');
		var options = {
			host : 'pharmaref1.attask-ondemand.com',
			path : 'https://pharmaref1.attask-ondemand.com/attask/api/task/' + taskID + '?fields=status,name&sessionID=' + sessionID,
			method : 'GET'
		};
		http.request(options, function(res) {
			res.setEncoding('utf8');
			res.on('data', function(chunk) {
				response.send(JSON.parse(chunk).data.status);
			});
		}).end();

	},
	complete : function(sessionID, taskID, response) {
		process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0
		var http = require('https');
		var options = {
			host : 'pharmaref1.attask-ondemand.com',
			path : 'https://pharmaref1.attask-ondemand.com/attask/api/task/' + taskID + '?fields=name,status&updates={status:"CPL"}&sessionID=' + sessionID,
			method : 'PUT'
		};

		http.request(options, function(res) {
			res.setEncoding('utf8');
			res.on('data', function(chunk) {
				response.send(JSON.parse(chunk).data.status);
			});
		}).end();

	}
}

return module.exports;
