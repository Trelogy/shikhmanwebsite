import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialLibraryComponent } from './social-library.component';

describe('SocialLibraryComponent', () => {
  let component: SocialLibraryComponent;
  let fixture: ComponentFixture<SocialLibraryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SocialLibraryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SocialLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
