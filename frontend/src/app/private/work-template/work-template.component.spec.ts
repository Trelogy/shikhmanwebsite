import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkTemplateComponent } from './work-template.component';

describe('WorkTemplateComponent', () => {
  let component: WorkTemplateComponent;
  let fixture: ComponentFixture<WorkTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkTemplateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
