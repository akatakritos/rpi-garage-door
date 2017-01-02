/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { DhmsPipe } from './dhms.pipe';

describe('DhmsPipe', () => {
    it('converts seconds to seconds', () => {
        let pipe = new DhmsPipe();
        expect(pipe.transform(15)).toBe('15s');
    });

    it ('converts to minutes seconds', () => {
        let pipe = new DhmsPipe();
        expect(pipe.transform(65)).toBe('1m 5s');
    });


    it('convets to hours minutes and seconds', () => {
        let pipe = new DhmsPipe();
        expect(pipe.transform(3904)).toBe('1h 5m 4s');
    });

    it('convets to days hours minutes and seconds', () => {
        let pipe = new DhmsPipe();
        expect(pipe.transform(90304)).toBe('1d 1h 5m 4s');
    });

    it ('truncates partial seconds', () => {
        let pipe = new DhmsPipe();
        expect(pipe.transform(15.12)).toBe('15s');
    });
});
