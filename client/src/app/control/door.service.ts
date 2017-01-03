import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
const io = require('socket.io-client');

export type DoorEventName = 'opened' | 'closed';

export interface Door {
    name: string;
    open: boolean;
    id: number;
}

export interface DoorEvent {
    id: number;
    event: DoorEventName;
}

@Injectable()
export class DoorService {

    events: Observable<DoorEvent>;

    constructor(private http: Http) {

        this.events = Observable.create(observer => {
            console.log('opened socket');
            const socket = io('');

            ['opened', 'closed'].forEach(event => {
                socket.on(event, data => {
                    observer.next({ id: data.id, event });
                });
            });

        });
    }

    getDoors() {
        return this.http.get('/api/doors')
            .map(response => <Door[]>response.json());
    }

    toggle(door: Door) {
        return this.http.post(`/api/doors/${door.id}/toggle`, '')
            .map(res => res.json());
    }



}
