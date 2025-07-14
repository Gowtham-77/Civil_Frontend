import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WelderPerformanceQualification } from './welder-performance-qualification';

describe('WelderPerformanceQualification', () => {
  let component: WelderPerformanceQualification;
  let fixture: ComponentFixture<WelderPerformanceQualification>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WelderPerformanceQualification]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WelderPerformanceQualification);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
