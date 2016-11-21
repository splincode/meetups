// ES5

// отправка сообщения
function sendMessage(){
	
	var nameUser = 'Максим';
	var currentDate = new Date(); 
	var el = document.querySelector('.send-text');
	var dateTime = currentDate.getHours() + ":" + currentDate.getMinutes() + ":" + currentDate.getSeconds();
	var data = el.value.replace(/\n/g, "<br>"); el.value = "";

	// записываем новый DOM
	document.querySelector('.col-message').innerHTML +=   
		'<div class="message-user">' + 
			'<span class="messege-remove label error outline">Удалить</span>' +
			'<p class="name"><samp>' + nameUser + '</samp><span class="time">' + dateTime + '</span></p>' +
			'<div>' +
				data +
			'</div>' +
		'</div>';

	// необходимо повесить событие удаления сообщения, когда добавили новый элемент
	var message = document.querySelectorAll('.messege-remove');
	Array.from(message).forEach(function(el) {
	    el.addEventListener('click', function(event) {
	       event.target.parentNode.remove();
	    });
	});
}

// событие клика по кнопке отправки сообщения
document.querySelector('.send-button').addEventListener("click", sendMessage); 
document.querySelector('.send-text').addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.keyCode === 13) sendMessage();
});