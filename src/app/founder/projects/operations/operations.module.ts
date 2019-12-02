import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';

import {AppElementsModule} from 'app/elements/elements.module';
import {MilestonesService} from 'app/projects/milestones.service';
import {FounderProjectOperationsComponent} from './operations.component';
import {MilestoneFormComponent} from './milestone-form/milestone-form.component';
import { MyPrimeNgModule } from 'app/my-prime-ng.module';
import { SlickModule } from 'ngx-slick';
import { NgCircleProgressModule } from 'ng-circle-progress';
import {PerfectScrollbarModule} from 'ngx-perfect-scrollbar';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AppElementsModule,
    MyPrimeNgModule,
    SlickModule,
    PerfectScrollbarModule.forChild(),
    NgCircleProgressModule.forRoot({
      // set defaults here
      radius: 100,
      outerStrokeWidth: 3,
      innerStrokeWidth: 3,
      outerStrokeColor: "#f58901",
      innerStrokeColor: "#dfdfdf",
      animationDuration: 300,
      animation:true,
      responsive:true,
      space:0,
    })
  ],
  exports: [
    FounderProjectOperationsComponent
  ],
  declarations: [
    FounderProjectOperationsComponent,
    MilestoneFormComponent
  ],
  providers: [
    MilestonesService
  ]
})
export class FounderProjectOperationsModule {}
