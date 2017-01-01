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

}
