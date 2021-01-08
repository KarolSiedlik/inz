import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingFirstLoginComponent } from './landing-first-login.component';

describe('LandingFirstLoginComponent', () => {
  let component: LandingFirstLoginComponent;
  let fixture: ComponentFixture<LandingFirstLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LandingFirstLoginComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingFirstLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
