import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fahrenheit'
})
export class FahrenheitPipe implements PipeTransform {

  transform(value: number, args?: any): string {
    return (value * 1.8 + 32).toFixed(0) + '° F';
  }

}
