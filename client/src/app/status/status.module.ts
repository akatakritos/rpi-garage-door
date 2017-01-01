import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusPageComponent } from './status-page.component';
import { StatusRoutingModule } from './status-routing.module';
import { StatusService } from './status.service';

import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    StatusRoutingModule,
    SharedModule
  ],
  declarations: [StatusPageComponent],
  providers: [
    StatusService
  ]
})
export class StatusModule { }
