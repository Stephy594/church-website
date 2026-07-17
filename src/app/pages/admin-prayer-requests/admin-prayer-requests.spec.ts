import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPrayerRequests } from './admin-prayer-requests';

describe('AdminPrayerRequests', () => {
  let component: AdminPrayerRequests;
  let fixture: ComponentFixture<AdminPrayerRequests>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminPrayerRequests],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminPrayerRequests);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
