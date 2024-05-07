import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ReorderGripComponent } from './reorder-grip.component';

describe('ReorderGripComponent', () => {
  let component: ReorderGripComponent;
  let fixture: ComponentFixture<ReorderGripComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ReorderGripComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReorderGripComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
