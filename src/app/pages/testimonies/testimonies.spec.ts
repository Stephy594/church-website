import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Testimonies } from './testimonies';

describe('Testimonies', () => {
  let component: Testimonies;
  let fixture: ComponentFixture<Testimonies>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Testimonies],
    }).compileComponents();

    fixture = TestBed.createComponent(Testimonies);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
