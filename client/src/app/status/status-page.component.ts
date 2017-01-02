import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/takeWhile';

import { StatusData, StatusService } from './status.service';

@Component({
  selector: 'app-status-page',
  templateUrl: './status-page.component.html',
})
export class StatusPageComponent implements OnInit, OnDestroy {

    data: StatusData;
    polling = false;

    constructor(private statusService: StatusService) {}

    ngOnInit() {
        this.startPolling();
    }

    ngOnDestroy() {
        console.log('unsubscribed');
        this.polling = false;
    }

    generateLabel(data: StatusData) {
        const used = data.totalMem - data.mem;
        return (used / data.totalMem * 100).toFixed(0) + '%';
    }

    startPolling() {
        const single = () => {
            this.statusService.getStatus().forEach(status => this.data = status);

            if (this.polling) {
                setTimeout(single, 1000);
            }
        };

        this.polling = true;
        single();
    }

}
