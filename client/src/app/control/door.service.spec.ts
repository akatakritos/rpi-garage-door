/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { DoorService } from './door.service';

describe('DoorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DoorService]
    });
  });

  it('should ...', inject([DoorService], (service: DoorService) => {
    expect(service).toBeTruthy();
  }));
});
