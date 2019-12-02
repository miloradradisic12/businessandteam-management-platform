import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssumptionSourceComponent } from './assumption-source.component';

describe('AssumptionSourceComponent', () => {
  let component: AssumptionSourceComponent;
  let fixture: ComponentFixture<AssumptionSourceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssumptionSourceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssumptionSourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
