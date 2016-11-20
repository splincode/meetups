window.globalName = "Максим"; // or: window.prompt('Введите ваше имя:');

// вывод нашего компонента в DOM
function messageComponent(name, text){
	let currentDate = new Date(); 
	let dateTime = currentDate.getHours() + ":" + currentDate.getMinutes() + ":" + currentDate.getSeconds();
	
	return ` 
		<div class="message-user">
			<span class="messege-remove label error outline">Удалить</span>
			<p class="name"><samp>${name}</samp><span class="time">${dateTime}</span></p>
			<div>
				${text}
			</div>
		</div>

	`;
}


// отправка сообщения
function sendMessage(){

	// получаем текст из textarea
	let el = $('.send-text');
	let data = el.val().replace(/\n/g, "<br>"); el.val('');

	// записываем новый DOM
	$('.col-message').append(messageComponent(globalName, data));

	// необходимо повесить событие удаления сообщения, когда добавили новый элемент
	$('.messege-remove').unbind('click').on('click', event => {
		console.log('remove event');
		event.target.parentNode.remove();
	});

}


// событие клика по кнопке отправки сообщения
$('.send-button').on('click', sendMessage);
$('.send-text').on('keydown', e => {
	if(e.ctrlKey && e.keyCode == 13){
      console.log('ctrl+enter');
      sendMessage();
    }
});