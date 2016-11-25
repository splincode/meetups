import { Component } from '@angular/core';

// import '../../public/css/styles.css';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
})
export class AppComponent { 

	title = "Maxim";
	sendMessage(){
		console.log(1)
		window.alert(1)
	}

}