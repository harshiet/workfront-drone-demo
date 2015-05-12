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
				$('#tasks').append('<tr id="tr_' + task.taskNumber + '"><td>' + task.taskNumber + '</td><td>' + task.name + '</td><td id="td_' + task.taskNumber + '" style="width:150px"></td></tr>');
			})
		}
	});
};

var completeTask = function(i) {
	$.ajax({
		url : '/complete?taskID=' + droneTasks[i].ID + '&sessionID=' + sessionID,
		success : function(data) {
			$('#td_' + droneTasks[i].taskNumber).html('Complete');
			$('#tr_' + droneTasks[i].taskNumber).css('background-color', '#dff0d8');
			$('#tr_' + droneTasks[i].taskNumber).css('color', '#3c763d');
			$('#progress-bar').css('width', ((i * 100) / droneTasks.length) + '%');
			$('#progress-bar').html(Math.round(((i * 100) / droneTasks.length), 0) + '%');
			if (droneTasks[i].taskNumber % 5 == 0) {
				$('html, body').animate({
					scrollTop : $('#tr_' + droneTasks[i].taskNumber).offset().top - 100
				}, 2000);
			}
			setTimeout(function() {
				if (i < droneTasks.length - 2) {
					setTimeout(function() {
						completeTask(i + 1);
					}, taskCompleteDelay);
				} else {
					var t = droneTasks[i + 1];
					$('#td_' + t.taskNumber).html('Manual Override');
					$('#tr_' + t.taskNumber).css('background-color', '#fcf8e3');
					$('#tr_' + t.taskNumber).css('color', '#8a6d3b');
					poll(t);
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
