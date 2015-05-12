var doProcess = function() {

	var taskCompleteDelay = 1000;
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
			url : '/complete?id=' + tasks[i].ID,
			success : function(tasks) {
				setTimeout(function() {
					if (i < tasks.length - 2) {
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
			url : '/poll?id=' + task.ID,
			success : function(tasks) {
				if (json.data.status == 'CPL') {
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
