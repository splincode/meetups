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
	let data = document.querySelector('.send-text').value.replace(/\n/g, "<br>");
	document.querySelector('.send-text').value = "";

	// записываем новый DOM
	window.document.querySelector('.col-message').innerHTML += messageComponent(globalName, data);

	// необходимо повесить событие удаления сообщения, когда добавили новый элемент
	let message = window.document.querySelectorAll('.messege-remove');
	Array.from(message).forEach(el => {
	    el.addEventListener('click', event => {
	       console.log('remove event');
	       event.target.parentNode.remove();
	    });
	});
}


// событие клика по кнопке отправки сообщения
window.document.querySelector('.send-button').addEventListener("click", sendMessage); 
window.document.querySelector('.send-text').addEventListener('keydown', e => {
    if (e.keyCode === 13) {
        if(e.ctrlKey) {
            console.log('ctrl+enter');
            sendMessage();
        }
    }
});