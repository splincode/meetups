## if - else


```html

<ng-template #preload>
  <p>Идет загрузка данных...</p>
</ng-template>

<div *ngIf="data.length; else preload">
  <p *ngFor="let item of data"> {{item }} </p>
</div>


```


## switch

```html

<div [ngSwitch]="date.getDay">
    <ng-template [ngSwitchCase]="0">
        <div>Воскресенье</div>
    </ng-template>
    <ng-template [ngSwitchCase]="1">
        <div>Понедельник</div>
    </ng-template>
    <ng-template [ngSwitchCase]="2">
        <div>Вторник</div>
    </ng-template>
    <ng-template [ngSwitchCase]="3">
        <div>Среда</div>
    </ng-template>
    ...
</div>

```