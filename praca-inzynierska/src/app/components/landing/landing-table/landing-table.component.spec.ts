import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingTableComponent } from './landing-table.component';

describe('LandingTableComponent', () => {
  let component: LandingTableComponent;
  let fixture: ComponentFixture<LandingTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LandingTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
