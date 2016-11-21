// ES6+
'use strict';

// отправка сообщения
function sendMessage(){

	// получаем текст из textarea
	let nameUser = 'Максим';
	let el = $('.send-text');
	let data = el.val().replace(/\n/g, "<br>"); el.val('');
	let currentDate = new Date(); 
	let dateTime = currentDate.getHours() + ":" + currentDate.getMinutes() + ":" + currentDate.getSeconds();

	// записываем новый DOM
	$('.col-message').append(` 
		<div class="message-user">
			<span class="messege-remove label error outline">Удалить</span>
			<p class="name"><samp>${nameUser}</samp><span class="time">${dateTime}</span></p>
			<div>
				${data}
			</div>
		</div>
	`);

	// необходимо повесить событие удаления сообщения, когда добавили новый элемент
	$('.messege-remove').unbind('click').on('click', e => e.target.parentNode.remove());
}

// событие клика по кнопке отправки сообщения
$('.send-button').on('click', sendMessage);
$('.send-text').on('keydown', e => { if (e.ctrlKey && e.keyCode == 13) sendMessage(); });