import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionItemTemplateComponent } from './collection-item-template.component';

describe('CollectionItemTemplateComponent', () => {
  let component: CollectionItemTemplateComponent;
  let fixture: ComponentFixture<CollectionItemTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollectionItemTemplateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionItemTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
