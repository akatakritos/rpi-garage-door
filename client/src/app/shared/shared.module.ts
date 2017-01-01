import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MbPipe } from './mb.pipe';
import { FahrenheitPipe } from './fahrenheit.pipe';
import { ProgressBarComponent } from './progress-bar.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [MbPipe, FahrenheitPipe, ProgressBarComponent ],
  exports: [
    MbPipe,
    FahrenheitPipe,
    ProgressBarComponent
  ]
})
export class SharedModule { }
