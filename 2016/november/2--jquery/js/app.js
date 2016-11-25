// ES6+
'use strict';

let textarea = $('.send-text'), 
	list = $('.col-message-list'), 
	timerName, nameUser, data, dateTime, currentDate;

// добавляем DOM
function addMessageToPageComponent(){
	$(list).append(` 
		<div class="message-user">
			<span class="messege-remove label error outline">Удалить</span>
			<p class="name"><samp>${nameUser}</samp><span class="time">${dateTime}</span></p>
			<div>
				${data}
			</div>
		</div>
	`);
}

// отправка сообщения
function sendMessage(){
	console.time(timerName);

	nameUser = 'Maxim';
	data = textarea.val().replace(/\n/g, "<br>"); textarea.val('');
	currentDate = new Date();
	dateTime = currentDate.getHours() + ":" + currentDate.getMinutes() + ":" + currentDate.getSeconds();
	
	// асинхронное добавление DOM элементов
	window.requestAnimationFrame(addMessageToPageComponent);

	console.timeEnd(timerName);
}

$('.send-button').on('click', sendMessage);
$('.col-message-list').on('click', '.messege-remove', e => e.target.parentNode.remove());
$('.send-text').on('keydown', e => { if (e.ctrlKey && e.keyCode == 13) sendMessage(); });