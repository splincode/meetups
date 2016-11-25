// ES5

var textarea = document.querySelector('.send-text'), 
	list = document.querySelector('.col-message-list'), 
	timerName, nameUser, data, dateTime;

// добавляем DOM
function addMessageToPageComponent(){
	list.innerHTML += [
		'<div class="message-user">', 
			'<span class="messege-remove label error outline">Удалить</span>', 
				'<p class="name"><samp>', nameUser, '</samp><span class="time">', dateTime, '</span></p>', 
				'<div>', data, '</div>',
		'</div>'
	].join('');

	// необходимо повесить событие удаления сообщения, когда добавили новый элемент
	var message = document.querySelectorAll('.messege-remove');
	Array.from(message).forEach(function(el) {
	    el.addEventListener('click', function(event) {
	       event.target.parentNode.remove();
	    });
	});
}

// отправка сообщения
function sendMessage(){
	console.time(timerName);

	nameUser = 'Максим';
	currentDate = new Date(); 
	dateTime = currentDate.getHours() + ":" + currentDate.getMinutes() + ":" + currentDate.getSeconds();
	data = textarea.value.replace(/\n/g, "<br>"); textarea.value = "";

	// асинхронное добавление DOM элементов
	// requestAnimationFrame -  просит браузер запланировать перерисовку на следующем кадре
	// это сэкономит ресурсы процессора и позволяет вашему устройству быть быстрее и жить дольше
	window.requestAnimationFrame(addMessageToPageComponent);

	console.timeEnd(timerName);
}

// событие клика по кнопке отправки сообщения
document.querySelector('.send-button').addEventListener("click", sendMessage); 
document.querySelector('.send-text').addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.keyCode === 13) sendMessage();
});