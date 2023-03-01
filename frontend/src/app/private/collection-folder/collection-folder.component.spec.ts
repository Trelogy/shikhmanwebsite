import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionFolderComponent } from './collection-folder.component';

describe('CollectionFolderComponent', () => {
  let component: CollectionFolderComponent;
  let fixture: ComponentFixture<CollectionFolderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollectionFolderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionFolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
