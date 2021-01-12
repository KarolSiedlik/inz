import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BmiInfoComponent } from './bmi-info.component';

describe('BmiInfoComponent', () => {
  let component: BmiInfoComponent;
  let fixture: ComponentFixture<BmiInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BmiInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BmiInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
