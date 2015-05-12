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

	doProcess : function() {
		var taskCompleteDelay = 1000;
		var sessionID = '';

		var predicatBy = function(prop) {
			return function(a, b) {
				if (a[prop] > b[prop]) {
					return 1;
				} else if (a[prop] < b[prop]) {
					return -1;
				}
				return 0;
			}
		};

		var getDroneTasks = function() {
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
					// console.log('str: ' + str);
					var json = JSON.parse(str);
					var tasks = json.data[0].tasks;
					tasks.sort(predicatBy('taskNumber'));
					// console.log('sorted tasks: ' + tasks);
					// console.log('tasks: ' + tasks);
					setTimeout(function() {
						completeTask(0, tasks);
					}, taskCompleteDelay);

				})
			}).end();
		}

		var poll = function(task) {
			console.log('Polling: ' + task.name);
			var options = {
				host : 'pharmaref1.attask-ondemand.com',
				// port : 443,
				path : 'https://pharmaref1.attask-ondemand.com/attask/api/task/' + task.ID + '?fields=status,name&sessionID=' + sessionID,
				method : 'GET'
			};
			http.request(options, function(res) {
				res.setEncoding('utf8');
				res.on('data', function(chunk) {
					var json = JSON.parse(chunk);
					if (json.data.status == 'CPL') {
						console.log('launch drone');
					} else {
						setTimeout(function() {
							poll(task);
						}, taskCompleteDelay);
					}
				});
			}).end();

		}
		var completeTask = function(i, tasks) {
			// console.log(i + ',' + tasks.length + ',' + tasks[i].taskNumber +
			// ',' + tasks[i].name);
			console.log('Completing: [' + tasks[i].taskNumber + '] ' + tasks[i].name);
			var options = {
				host : 'pharmaref1.attask-ondemand.com',
				path : 'https://pharmaref1.attask-ondemand.com/attask/api/task/' + tasks[i].ID + '?fields=name,status&updates={status:"CPL"}&sessionID=' + sessionID,
				method : 'PUT'
			};

			http.request(options, function(res) {
				res.setEncoding('utf8');
				res.on('data', function(chunk) {
					// var json = JSON.parse(chunk);
					// console.log(chunk);
				});
				res.on('end', function() {
					if (i < tasks.length - 2) {
						setTimeout(function() {
							completeTask(i + 1, tasks);
						}, taskCompleteDelay);
					} else {
						poll(tasks[i + 1]);
					}
				});
			}).end();
		}
	}
}
return module.exports;
