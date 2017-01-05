import { Component, OnInit, OnDestroy, ViewChildren , QueryList } from '@angular/core';
import { DoorService, Door, DoorEvent } from './door.service';
import { DoorControlComponent } from './door-control.component';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'control-page',
    templateUrl: './control-page.component.html',
})
export class ControlPageComponent implements OnInit, OnDestroy {

    doors: Door[] = [];

    @ViewChildren(DoorControlComponent)
    doorComponents: QueryList<DoorControlComponent>;

    events: Subscription;

    constructor(private doorService: DoorService) { }

    ngOnInit() {
        this.doorService.getDoors().subscribe(d => this.doors = d);
        this.events = this.doorService.events().subscribe(e => this.handleEvent(e));
    }

    ngOnDestroy() {
        this.events.unsubscribe();
    }

    handleEvent(e: DoorEvent) {

        const door = this.doors.find(d => d.id === e.id);
        const child = this.doorComponents.find(c => c.door === door);

        door.lastChange = e.timestamp;

        if (e.eventName === 'closed') {
            door.open = false;
            child.postMessage('Door Closed');
        } else if (e.eventName === 'opened') {
            door.open = true;
            child.postMessage('Door Opened');
        }
    }

    toggle(door:Door) {
        const child = this.doorComponents.find(c => c.door === door);

        this.doorService.toggle(door).subscribe(() => {
            const verb = door.open ? 'Closing' : 'Opening';
            child.postMessage(`${verb} the door`);
        });
    }

}
