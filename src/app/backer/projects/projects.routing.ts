import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {BackerProjectsOverviewComponent} from './overview/overview.component';
import { BackerLaunchTypeComponent } from 'app/backer/projects/backer-launch-type/backer-launch-type.component';
import { BackerFundingComponent } from 'app/backer/projects/backer-funding/backer-funding.component';
import { BackerFundingTypeComponent } from 'app/backer/projects/backer-funding/backer-funding-type/backer-funding-type.component';
import { PlaceOrderComponent } from 'app/backer/projects/place-order/place-order.component';
import { BackerProjectsSummaryComponent } from 'app/backer/projects/summary/summary.component';
import { NdaAgreementComponent } from 'app/backer/projects/nda-agreement/nda-agreement.component';
import { ProjectTradingComponent } from 'app/backer/projects/project-trading/project-trading.component';
import { BackerChatRoomComponent } from './backer-chat-room/backer-chat-room.component';


const routes: Routes = [
  {
    path: '',
    component: BackerProjectsOverviewComponent
  },
  {
    path: 'chat-rooms',
    component: BackerChatRoomComponent
  },
  {
    path: ':id/summary',
    component: BackerProjectsSummaryComponent
  },
  {
    path: ':id/nda',
    component: NdaAgreementComponent
  },
  {
    path: ':id/project-trading',
    component: ProjectTradingComponent
  },
  {
    path: ':id/launch',
    component: BackerLaunchTypeComponent
  },
  {
    path: ':id/funding',
    component: BackerFundingComponent
  },
  {
    path: ':id/funding/fundingtype',
    component: BackerFundingTypeComponent
  },
  {
    path: ':id/backerfundingtype/placeorder',
    component: PlaceOrderComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BackerProjectsRoutingModule {}
