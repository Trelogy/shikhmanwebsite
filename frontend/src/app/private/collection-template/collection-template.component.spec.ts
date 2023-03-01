import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionTemplateComponent } from './collection-template.component';

describe('CollectionTemplateComponent', () => {
  let component: CollectionTemplateComponent;
  let fixture: ComponentFixture<CollectionTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollectionTemplateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
