import { TestBed, inject } from '@angular/core/testing';

import { CropperService } from './cropper.service';

describe('CropperService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CropperService]
    });
  });

  it('should be created', inject([CropperService], (service: CropperService) => {
    expect(service).toBeTruthy();
  }));
});
