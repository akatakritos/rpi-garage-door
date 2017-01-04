import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ControlPageComponent } from './control-page.component';
import { DoorControlComponent } from './door-control.component';
import { DoorService, Door } from './door.service';
import { SharedModule } from '../shared/shared.module';
import { DoorEventLogComponent } from './door-event-log.component';

export {
    ControlPageComponent,
    DoorControlComponent,
    DoorService,
    Door,
}


const routes: Routes = [
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        SharedModule
    ],
    declarations: [ControlPageComponent, DoorControlComponent, DoorEventLogComponent],
    exports: [ RouterModule ],
    providers: [ DoorService ]
})
export class ControlModule { }
