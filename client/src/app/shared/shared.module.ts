import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MbPipe } from './mb.pipe';
import { FahrenheitPipe } from './fahrenheit.pipe';
import { ProgressBarComponent } from './progress-bar.component';
import { DhmsPipe } from './dhms.pipe';
import { AlertComponent } from './alert.component';

export { MbPipe, FahrenheitPipe, ProgressBarComponent, AlertComponent };

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [MbPipe, FahrenheitPipe, ProgressBarComponent, DhmsPipe, AlertComponent ],
  exports: [
    MbPipe,
    FahrenheitPipe,
    ProgressBarComponent,
    DhmsPipe,
    AlertComponent,
  ]
})
export class SharedModule { }
