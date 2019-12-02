import { NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {BackerHomeComponent} from './home/home.component';
import {IsRegularUser} from '../auth/permissions';

const routes: Routes = [
  {
    path: '',
    component: BackerHomeComponent
  },
  {
    path: 'projects',
    loadChildren: 'app/backer/projects/projects.module#BackerProjectsModule',
    canActivate: [IsRegularUser]
  },
  {
    path: 'trading',
    loadChildren: 'app/backer/trading/trading.module#TradingModule',
    canActivate: [IsRegularUser]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BackerRoutingModule {}
