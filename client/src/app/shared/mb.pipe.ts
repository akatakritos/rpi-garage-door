import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mb'
})
export class MbPipe implements PipeTransform {

  transform(value: number, args?: any): string {
    const mb = value / 1024 / 1024;
    return mb.toFixed(0) + ' MB';
  }

}
