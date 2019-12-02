import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttachSourceDrawingComponent } from './attach-source-drawing.component';

describe('AttachSourceDrawingComponent', () => {
  let component: AttachSourceDrawingComponent;
  let fixture: ComponentFixture<AttachSourceDrawingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttachSourceDrawingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttachSourceDrawingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
