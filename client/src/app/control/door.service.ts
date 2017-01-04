import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
const io = require('socket.io-client');

export type DoorEventName = 'opened' | 'closed';

export interface Door {
    name: string;
    open: boolean;
    id: number;
    lastChange: string;
}

export interface DoorEvent {
    id: number;
    name: string;
    eventName: DoorEventName;
    timestamp: string;
}

@Injectable()
export class DoorService {

    private _events: Subject<DoorEvent>;

    constructor(private http: Http) {

        this._events = new Subject();
        console.log('opened socket');
        const socket = io('');

        ['opened', 'closed'].forEach(event => {
            socket.on(event, data => {
                this._events.next(data);
            });
        });
    }

    events(): Observable<DoorEvent> {
        return this._events;
    }

    getDoors() {
        return this.http.get('/api/doors')
            .map(response => <Door[]>response.json());
    }

    toggle(door: Door) {
        return this.http.post(`/api/doors/${door.id}/toggle`, '')
            .map(response => true);
    }


    logs() {
        return this.http.get('/api/doors/logs')
            .map(response => response.json());
    }

}
