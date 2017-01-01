import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'progress-bar',
    templateUrl: './progress-bar.component.html',
})
export class ProgressBarComponent implements OnInit {

    @Input()
    max: number;

    @Input()
    current: number;

    @Input()
    label: string;

    @Input()
    changeColors = true;

    get percent() {
        return this.current / this.max * 100;
    }

    get className() {
        if (!this.changeColors) {
            return 'progress-bar-info';
        }

        const percent = this.percent;
        if (percent > 87) {
            return 'progress-bar-danger';
        } else if (percent > 70) {
            return 'progress-bar-warning';
        }

        return 'progress-bar-success';
    }

    constructor() { }

    ngOnInit() {
    }

}
