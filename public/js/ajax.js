var doProcess = function() {

	var taskCompleteDelay = 100;
	var sessionID = '';
	$.ajax({
		url : '/login',
		success : function(data) {
			sessionID = data;
			getDroneTasks();
		}
	});

	var getDroneTasks = function() {
		$.ajax({
			url : '/tasks?sessionID=' + sessionID,
			success : function(tasks) {
				setTimeout(function() {
					completeTask(0, tasks);
				}, taskCompleteDelay);
			}
		});
	};

	var completeTask = function(i, tasks) {
		$.ajax({
			url : '/complete?taskID=' + tasks[i].ID + '&sessionID=' + sessionID,
			success : function(data) {
				console.log(data);
				setTimeout(function() {
					if (i < tasks.length - 84) {
						setTimeout(function() {
							completeTask(i + 1, tasks);
						}, taskCompleteDelay);
					} else {
						poll(tasks[i + 1]);
					}
				}, taskCompleteDelay);
			}
		});
	};

	var poll = function(task) {
		$.ajax({
			url : '/poll?taskID=' + task.ID + '&sessionID=' + sessionID,
			success : function(data) {
				if (data == 'CPL') {
					console.log('launch drone');
				} else {
					setTimeout(function() {
						poll(task);
					}, taskCompleteDelay);
				}
			}
		});
	}

}
