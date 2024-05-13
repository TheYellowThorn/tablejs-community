import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrollPrevSpacerComponent } from './scroll-prev-spacer.component';

describe('ScrollPrevSpacerComponent', () => {
  let component: ScrollPrevSpacerComponent;
  let fixture: ComponentFixture<ScrollPrevSpacerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScrollPrevSpacerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScrollPrevSpacerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
