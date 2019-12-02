import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DecisionPollSourceComponent } from './decision-poll-source.component';

describe('DecisionPollSourceComponent', () => {
  let component: DecisionPollSourceComponent;
  let fixture: ComponentFixture<DecisionPollSourceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DecisionPollSourceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DecisionPollSourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
