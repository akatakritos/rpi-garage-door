import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MbPipe } from './mb.pipe';
import { FahrenheitPipe } from './fahrenheit.pipe';
import { ProgressBarComponent } from './progress-bar.component';
import { DhmsPipe } from './dhms.pipe';
import { AlertComponent } from './alert.component';
import { TimeagoPipe } from './timeago.pipe';
import { LocalTimePipe } from './local-time.pipe';

export { MbPipe, FahrenheitPipe, ProgressBarComponent, AlertComponent };

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [MbPipe, FahrenheitPipe, ProgressBarComponent, DhmsPipe, AlertComponent, TimeagoPipe, LocalTimePipe ],
  exports: [
    MbPipe,
    FahrenheitPipe,
    ProgressBarComponent,
    DhmsPipe,
    AlertComponent,
    TimeagoPipe,
    LocalTimePipe,
  ]
})
export class SharedModule { }
