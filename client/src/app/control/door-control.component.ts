import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Door } from './door.service';

@Component({
    selector: 'door-control',
    templateUrl: './door-control.component.html',
})
export class DoorControlComponent implements OnInit {

    @Input()
    door: Door;

    @Output()
    toggled = new EventEmitter();

    private message: string;

    constructor() { }

    ngOnInit() {
    }

    toggle() {
        this.toggled.emit();
    }

    private handle: any;
    postMessage(msg: string) {

        this.message = msg;

        if (this.handle) {
            clearTimeout(this.handle);
        }

        this.handle = setTimeout(() => {
            this.onAlertDismissed();
        }, 2000);
    }

    onAlertDismissed() {
        this.message = null;
        this.handle = null;
    }

}