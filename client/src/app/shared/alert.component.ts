import { Component, OnInit, trigger, state, style, transition, animate, Input, Output, EventEmitter } from '@angular/core';


@Component({
    templateUrl: './alert.component.html',
    selector: 'alert',
    animations: [
        trigger('fadeOut', [
            transition(':leave', [
                animate('250ms', style({ opacity: 0 }))
            ])
        ])
    ]
})
export class AlertComponent implements OnInit {

    @Input()
    message: string;

    @Input()
    title: string = null;

    @Output()
    dismissed = new EventEmitter();

    @Input()
    type: 'success' | 'info' | 'danger' | 'warning' = 'info';

    constructor() { }

    ngOnInit() {

    }

    get className() {
        return `alert-${this.type}`;
    }

    dismiss() {
        this.dismissed.emit();
    }
}