var taskCompleteDelay = 100;
var sessionID = '';
var droneTasks;
var login = function() {
	$.ajax({
		url : '/login',
		success : function(data) {
			console.log(data);
			sessionID = data;
		},
		async : false
	});
};

var getDroneTasks = function() {
	$.ajax({
		url : '/tasks?sessionID=' + sessionID,
		async : false,
		success : function(tasks) {
			droneTasks = tasks;
			$.each(tasks, function(i, task) {
				$('#tasks').append('<tr id="tr_' + task.taskNumber + '"><td>' + task.taskNumber + '</td><td>' + task.name + '</td><td id="td_' + task.taskNumber + '"></td></tr>');
			})
		}
	});
};

var completeTask = function(i) {
	$.ajax({
		url : '/complete?taskID=' + droneTasks[i].ID + '&sessionID=' + sessionID,
		success : function(data) {
			$('#td_' + droneTasks[i].taskNumber).html('Complete');
			$('#tr_' + droneTasks[i].taskNumber).css('background-color','#dff0d8');
			$('#tr_' + droneTasks[i].taskNumber).css('color','#3c763d');
			$('#progress-bar').css('width', ((i * 100) / droneTasks.length) + '%');
			$('#progress-bar').html(Math.round(((i * 100) / droneTasks.length), 0) + '%');
			setTimeout(function() {
				if (i < droneTasks.length - 50) {
					setTimeout(function() {
						completeTask(i + 1);
					}, taskCompleteDelay);
				} else {
					poll(droneTasks[i + 1]);
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
