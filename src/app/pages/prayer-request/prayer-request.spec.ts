import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrayerRequest } from './prayer-request';

describe('PrayerRequest', () => {
  let component: PrayerRequest;
  let fixture: ComponentFixture<PrayerRequest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrayerRequest],
    }).compileComponents();

    fixture = TestBed.createComponent(PrayerRequest);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
