import { Pipe, PipeTransform } from '@angular/core';

const SEC_PER_MIN = 60;
const SEC_PER_HOUR = 60 * SEC_PER_MIN;
const SEC_PER_DAY = 24 * SEC_PER_HOUR;

function symbol(duration, symbol) {
    return duration ? duration + symbol + ' ' : '';
}

@Pipe({
    name: 'dhms'
})
export class DhmsPipe implements PipeTransform {

    transform(value: number, args?: any): string {
        const days = Math.floor(value / SEC_PER_DAY);
        value -= days * SEC_PER_DAY;

        const hours = Math.floor(value / SEC_PER_HOUR);
        value -= hours * SEC_PER_HOUR;

        const minutes = Math.floor(value / SEC_PER_MIN);
        value -= minutes * SEC_PER_MIN;

        const seconds = Math.floor(value);

        return (symbol(days, 'd') + symbol(hours, 'h') + symbol(minutes, 'm') + symbol(seconds, 's')).trim();
    }

}
