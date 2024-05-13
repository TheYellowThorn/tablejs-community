import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DragAndDropGhostComponent } from './drag-and-drop-ghost.component';

describe('DragAndDropGhostComponent', () => {
  let component: DragAndDropGhostComponent;
  let fixture: ComponentFixture<DragAndDropGhostComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DragAndDropGhostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DragAndDropGhostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
