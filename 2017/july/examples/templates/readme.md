```html

<ng-template #preload>
  <p>Идет загрузка данных...</p>
</ng-template>

<div *ngIf="data.length; else preload">
  <p *ngFor="let item of data"> {{item }} </p>
</div>


```