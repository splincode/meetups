import { Component } from '@angular/core';

interface ListMessage {
    data: string;
    dateTime: string;    
};

@Component({
  selector: 'message-box',
  templateUrl: './message-box.html',
})
export class MessageBoxComponent { 

	public nameUser;
	public listMessage: ListMessage[];
	public textMessage: string;

	constructor(){
		this.nameUser = "Максим";
		this.listMessage = [];
	};

	/**
	 * [Отправляем сообщение в чат]
	 * @param {string} _textMessage [текст сообщения]
	 */
	sendMessage(_textMessage: string){

		let date: Date = new Date();

		this.listMessage.push({
			data: _textMessage,
			dateTime: `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
		});

		this.textMessage = "";
	}

	/**
	 * [Удаление сообщения]
	 * @param {number} i [Номер сообщения в массиве]
	 */
	removeMessage(i: number){
		this.listMessage.splice(i, 1);
	}
}