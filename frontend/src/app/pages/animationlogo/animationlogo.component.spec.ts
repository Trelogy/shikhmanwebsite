import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimationlogoComponent } from './animationlogo.component';

describe('AnimationlogoComponent', () => {
  let component: AnimationlogoComponent;
  let fixture: ComponentFixture<AnimationlogoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnimationlogoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnimationlogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
