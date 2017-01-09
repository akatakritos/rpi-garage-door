import { Component } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import 'rxjs/add/operator/filter';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
})
export class AppComponent {
    open = false;

    constructor(private router: Router) {
        this.router.events
            .filter(e => e instanceof NavigationStart)
            .subscribe(e => {
                this.open = false;
            });

    }

}
