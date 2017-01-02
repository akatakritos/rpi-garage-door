import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MbPipe } from './mb.pipe';
import { FahrenheitPipe } from './fahrenheit.pipe';
import { ProgressBarComponent } from './progress-bar.component';
import { DhmsPipe } from './dhms.pipe';

export { MbPipe, FahrenheitPipe, ProgressBarComponent };

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [MbPipe, FahrenheitPipe, ProgressBarComponent, DhmsPipe ],
  exports: [
    MbPipe,
    FahrenheitPipe,
    ProgressBarComponent,
    DhmsPipe
  ]
})
export class SharedModule { }
