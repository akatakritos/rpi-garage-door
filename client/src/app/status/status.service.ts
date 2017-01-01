import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

export interface StatusData {
    mem: number;
    hostname: string;
    loadavg: number[];
    temp: number;
}

@Injectable()
export class StatusService {

    constructor(private http: Http) { }

    getStatus() {
        return this.http.get('/api/status')
            .map(response => <StatusData>response.json());
    }
}
