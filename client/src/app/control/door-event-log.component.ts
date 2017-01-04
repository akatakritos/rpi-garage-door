import { Component, OnInit, OnDestroy } from '@angular/core';
import { DoorService, DoorEvent } from './door.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'door-event-log',
    templateUrl: './door-event-log.component.html',
})
export class DoorEventLogComponent implements OnInit, OnDestroy {

    logs: DoorEvent[] = [];

    private eventSubscription: Subscription;

    constructor(private doorService: DoorService) { }

    ngOnInit() {
        this.doorService.logs().subscribe(l => this.logs = l);
        this.eventSubscription = this.doorService.events().subscribe(e => this.handleDoorEvent(e));
    }

    ngOnDestroy() {
        this.eventSubscription.unsubscribe();
    }

    handleDoorEvent(e: DoorEvent) {
        this.logs.unshift(e);
    }

    eventClass(e: DoorEvent) {
        switch(e.eventName) {
            case 'opened': return 'alert-warning';
            case 'closed': return 'alert-success';
            default: return 'alert-info';
        }
    }
}
