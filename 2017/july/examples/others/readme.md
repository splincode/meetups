## Renderer is deprecated, you need use Renderer2

```javascript

import { Component,Renderer2 } from '@angular/core';  
  
@Component({  
  selector: 'app-root',  
  templateUrl: './app.component.html',  
  styleUrls: ['./app.component.css']  
})  
export class AppComponent {  
  constructor(private renderer:Renderer2){}  
  
  onChangeBackground(element:HTMLElement){  
    this.renderer.setStyle(element,'background-color','#000');  
    this.renderer.setStyle(element,'color','#fff');  
  }  
}  

```


## Email validation

### Angular 2

```html
<form #frm="ngForm">  
<label>Email</label>  
        <input  
            type="email"  
            ngModel  
            name="email"  
            required  
            style="width:300px"  
            pattern="^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$"/>  
            <button [disabled]=!frm.valid>Submit</button>  
</form> 
```

### Angular 4

```html
<form #frm="ngForm">  
<label>Email</label>  
        <input  
            type="email"  
            ngModel  
            name="email"  
            required  
            style="width:300px"  
            email/>  
            <button [disabled]=!frm.valid>Submit</button>  
</form> 
```