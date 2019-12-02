import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BackerChatRoomComponent } from './backer-chat-room.component';

describe('BackerChatRoomComponent', () => {
  let component: BackerChatRoomComponent;
  let fixture: ComponentFixture<BackerChatRoomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BackerChatRoomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackerChatRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
