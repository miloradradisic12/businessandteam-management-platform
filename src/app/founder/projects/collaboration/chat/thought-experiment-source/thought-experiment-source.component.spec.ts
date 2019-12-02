import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThoughtExperimentSourceComponent } from './thought-experiment-source.component';

describe('ThoughtExperimentSourceComponent', () => {
  let component: ThoughtExperimentSourceComponent;
  let fixture: ComponentFixture<ThoughtExperimentSourceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThoughtExperimentSourceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThoughtExperimentSourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
