import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {FounderHomeComponent} from './home/home.component';
import {IsRegularUser} from 'app/auth/permissions';
import {TextEditorComponent} from 'app/elements/text-editor/text-editor.component';
import { EmployeeRatingComponent } from 'app/common/employee-rating/employee-rating.component';
import { WalletComponent } from 'app/common/wallet/wallet.component';
import { BankAccountComponent } from 'app/common/wallet/bank-account/bank-account.component';
import { TransactionsComponent } from 'app/common/wallet/transactions/transactions.component';
import { TradeHistoryComponent } from 'app/common/wallet/trade-history/trade-history.component';
import { FundingDetailsComponent } from 'app/common/wallet/trade-history/funding-details/funding-details.component';

const routes: Routes = [
  {
    path: '',
    component: FounderHomeComponent
  },
  {
    path: 'idea',
    loadChildren: './idea/idea.module#IdeaModule'
  },
  {
    path: 'projects',
    loadChildren: 'app/founder/projects/projects.module#FounderProjectsModule',
    canActivate: [IsRegularUser]
  },
  {
    path: 'forum-overview',
    loadChildren: 'app/founder/forum/forum.module#ForumModule'
  },
  {
    path: 'account',
    loadChildren: 'app/founder/account/account.module#FounderAccountModule'
  },
  {
    path: 'startup/:id',
    loadChildren: './startup/startup.module#FounderStartupModule',
    canActivate: [IsRegularUser]
  },
  {
    path: 'editor',
    component: TextEditorComponent
  },  
  {
    path: ':empId/employee-rating',
    component: EmployeeRatingComponent
    
  },
  {
    path: 'wallet',
    component: WalletComponent
  },
  {
    path: 'bank-account',
    component: BankAccountComponent
  },
  {
    path: 'transactions',
    component: TransactionsComponent
  },
  {
    path: 'trade-history',
    component: TradeHistoryComponent
  },
  {
    path: 'funding-details',
    component: FundingDetailsComponent
  },
  
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FounderRoutingModule {}
