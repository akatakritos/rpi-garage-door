import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
    name: 'localTime'
})
export class LocalTimePipe implements PipeTransform {

    transform(value: string, args?: any): string {
        const local = moment(value).local();
        return local.format('YYYY-MM-DD HH::mm::ss');
    }

}
