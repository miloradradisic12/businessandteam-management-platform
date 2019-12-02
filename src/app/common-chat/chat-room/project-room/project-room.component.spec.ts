import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectRoomComponent } from './project-room.component';

describe('ProjectRoomComponent', () => {
  let component: ProjectRoomComponent;
  let fixture: ComponentFixture<ProjectRoomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectRoomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
