import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Subscriber } from 'rxjs/Subscriber';
import 'rxjs/add/operator/map';

export interface NetworkInterface {
    name: string;
    ip: string;
}

export interface StatusData {
    mem: number;
    hostname: string;
    loadavg: number[];
    temp: number;
    totalMem: number;
    systemUptime: number;
    serverUptime: number;
    ips: NetworkInterface[];
}

@Injectable()
export class StatusService {

    constructor(private http: Http) { }

    getStatus() {
        return this.http.get('/api/status')
            .map(response => <StatusData>response.json());
    }
}
