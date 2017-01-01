import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MbPipe } from './mb.pipe';
import { FahrenheitPipe } from './fahrenheit.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [MbPipe, FahrenheitPipe],
  exports: [
    MbPipe,
    FahrenheitPipe
  ]
})
export class SharedModule { }
