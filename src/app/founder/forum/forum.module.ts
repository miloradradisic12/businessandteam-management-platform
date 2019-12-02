import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ForumRoutingModule } from './forum-routing.module';
import { ForumOverviewComponent } from './forum-overview/forum-overview.component';
import { ForumOverviewModule } from './forum-overview/forum-overview.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

@NgModule({
  imports: [
    CommonModule,
    ForumOverviewModule,
    ForumRoutingModule,
    //PerfectScrollbarModule.forChild(),
  ]
})
export class ForumModule { }
