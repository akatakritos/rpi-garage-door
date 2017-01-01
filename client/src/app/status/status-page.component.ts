import { Component, OnInit } from '@angular/core';

import { StatusData, StatusService } from './status.service';

@Component({
  selector: 'app-status-page',
  templateUrl: './status-page.component.html',
})
export class StatusPageComponent implements OnInit {

    data: StatusData;

    constructor(private statusService: StatusService) {}

    ngOnInit() {
        this.statusService.getStatus().forEach(s => this.data = s);
    }

    generateLabel(data: StatusData) {
        const used = data.totalMem - data.mem;
        return (used / data.totalMem * 100).toFixed(0) + '%';
    }
}
