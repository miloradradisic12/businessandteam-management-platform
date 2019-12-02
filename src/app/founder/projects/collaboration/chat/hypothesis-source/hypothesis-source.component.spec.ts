import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HypothesisSourceComponent } from './hypothesis-source.component';

describe('HypothesisSourceComponent', () => {
  let component: HypothesisSourceComponent;
  let fixture: ComponentFixture<HypothesisSourceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HypothesisSourceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HypothesisSourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
