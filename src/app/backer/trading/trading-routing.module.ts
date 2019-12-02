import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TradingTypeComponent } from './trading-type/trading-type.component';
import { TradingListingComponent } from './trading-listing/trading-listing.component';
import { ProjectLaunchComponent } from './trading-listing/project-launch/project-launch.component';
import { ProjectLaunchingSoonComponent } from './trading-listing/project-launching-soon/project-launching-soon.component';
import { MySharesComponent } from './my-shares/my-shares.component';
import { MyFundedProjectsComponent } from './my-shares/my-funded-projects/my-funded-projects.component';
import { SimilarProjectsComponent } from './my-shares/similar-projects/similar-projects.component';
import { MyShareXComponent } from './my-shares/my-funded-projects/my-share-x/my-share-x.component';
import { MyHoldingsLsxComponent } from './my-shares/my-funded-projects/my-holdings-lsx/my-holdings-lsx.component';
import { MyHoldingsIsxComponent } from './my-shares/my-funded-projects/my-holdings-isx/my-holdings-isx.component';
import { ProjectStockComponent } from './project-stock/project-stock.component';

const routes: Routes = [
  {
    path: '',
    component: TradingTypeComponent
  },
  {
    path: ':pagename/:id/projecttrading',
    component: ProjectStockComponent
  },
  {
    path: 'myshares',
    component: MySharesComponent
  },
  {
    path: ':pagename',
    component: TradingListingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TradingRoutingModule { }
