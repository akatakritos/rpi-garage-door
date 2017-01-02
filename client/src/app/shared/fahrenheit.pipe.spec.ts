/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { FahrenheitPipe } from './fahrenheit.pipe';

describe('FarenheitPipe', () => {
    it('create an instance', () => {
        let pipe = new FahrenheitPipe();
        expect(pipe).toBeTruthy();
    });

    it('converts temperatures', () => {
        const pipe = new FahrenheitPipe();
        expect(pipe.transform(0)).toBe('32° F');
    });
});
