import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
    name: 'timeago'
})
export class TimeagoPipe implements PipeTransform {

    transform(value: string, args?: any): string {
        const time = moment(value);
        return time.fromNow();
    }

}
