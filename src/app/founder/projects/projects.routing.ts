import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {FounderProjectsOverviewComponent} from './overview/overview.component';
import {FounderProjectDetailsComponent} from './details/details.component';
import {FounderProjectOperationsComponent} from './operations/operations.component';
import {ProjectCollaborationComponent} from './collaboration/collaboration.component';
import {FounderProjectSummaryComponent} from './summary/summary.component';
import {FounderProjectOperationsModule} from './operations/operations.module';
import {CollaborationDocumentComponent} from './collaboration/document/document.component';
import {CollaborationGoalProcessesComponent} from './collaboration/goal-processes/goal-processes.component';
import {CollaborationProcessDocumentsComponent} from './collaboration/process-documents/process-documents.component';
import {DocumentChatComponent} from './collaboration/chat/chat.component';
import { FounderProjectRecruitmentComponent } from './recruitment/recruitment.component';
import { EmployeeProfileComponent } from './employee-profile/employee-profile.component';
import { ProcessesWorkedOnComponent } from './employee-profile/processes-worked-on/processes-worked-on.component';
import { MakePaymentComponent } from './employee-profile/make-payment/make-payment.component';
import { NdaComponent } from './summary/nda/nda.component';
import { ActivityFeedComponent } from './details/activity-feed/activity-feed.component';
import { ProcessDueSoonComponent } from './details/process-due-soon/process-due-soon.component';
import { FounderProjectLaunchComponent } from './launch/launch.component';
import { FounderProjectLaunchedComponent } from './launch/launched/launched.component';
import { FounderProjectManageFundComponent } from 'app/founder/projects/managefund/managefund.component';
import { FounderProjectFundingTypeComponent } from 'app/founder/projects/managefund/funding-type/funding-type.component';
import { NotarizationComponent } from './notarization/notarization.component';
import { SentNotarizationComponent } from './sent-notarization/sent-notarization.component';
import { ViewnotarizationComponent } from './viewnotarization/viewnotarization.component';
import { CommonComponentModule } from 'app/common/common.module';
import { FounderProjectEditFundingTypeComponent } from 'app/founder/projects/managefund/edit/edit-fund-type.component';
import { ChatRoomsComponent } from 'app/founder/projects/chat-rooms/chat-rooms.component';
import { EmployeePay } from './recruitment/pay/employee-pay.component';


const routes: Routes = [
  {
    path: '',
    component: FounderProjectsOverviewComponent
  },
  {
    path: 'chat-rooms',
    component: ChatRoomsComponent
  },
  {
    path: ':id',
    component: FounderProjectDetailsComponent
  },
  {
    path: ':id/task',
    loadChildren: 'app/founder/projects/details/task-dashboard/task-dashboard.module#TaskDashboardModule'
  },
  {
    path: ':id/boards',
    loadChildren: 'app/founder/projects/details/boards/boards.module#FounderProjectsDetailsBoardsModule'
  },
  {
    path: ':id/operations',
    component: FounderProjectOperationsComponent
  },
  {
    path: ':id/collaboration',
    component: ProjectCollaborationComponent,
    children: [
      {path: 'goal/:goalId', component: CollaborationGoalProcessesComponent, outlet: 'documents'},
      {path: 'process/:processId', component: CollaborationProcessDocumentsComponent, outlet: 'documents'},
      {path: 'document/:documentId', component: CollaborationDocumentComponent, outlet: 'documents'},
      {path: 'chat/:processId', component: DocumentChatComponent, outlet: 'chat'}
    ]
  },
  {
    path: ':id/summary',
    component: FounderProjectSummaryComponent
  },
  {
    path: ':id/launch',
    component: FounderProjectLaunchComponent
  },
  {
    path: ':id/managefund',
    component: FounderProjectManageFundComponent
  },
  {
    path: ':id/managefund/fundingtype',
    component: FounderProjectFundingTypeComponent
  },
  {
    path: ':id/managefund/:fundid/edit',
    component: FounderProjectEditFundingTypeComponent
  },
  {
    path: ':id/recruitment',
    component: FounderProjectRecruitmentComponent,
  },
  {
    path: ':id/recruitment/:empid/profile',
    component: EmployeeProfileComponent
  },
  {
    path:':id/recruitment/:empid/pay',
    component: EmployeePay
  },
  {
    path: ':id/recruitment/:empid/ProcessesWorkedOn',
    component: ProcessesWorkedOnComponent
  },
  {
    path: ':id/MakePayment',
    component: MakePaymentComponent
  },
  {
    //path: ':id/register',
    path: ':id/register',
    loadChildren: './register/register.module#ProjectRegisterModule'
  },
  
  {
    path: ':id/budget',
    loadChildren: './budget/budget.module#BudgetModule'
  },
  {
    path: ':id/nda',
    component: NdaComponent
  },
  {
    path: ':id/activity-feed',
    component: ActivityFeedComponent
  },
  {
    path: ':id/processesdue-soon',
    component: ProcessDueSoonComponent
  },
  {
    path: ':id/notarization',
    component: NotarizationComponent
  }
  ,
  {
    path: ':id/sentnotarization',
    component: SentNotarizationComponent  
  },
  {
    path: ':id/viewnotarization',
    component: ViewnotarizationComponent  
  },

  
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    FounderProjectOperationsModule
  ],
  exports: [RouterModule]
})
export class FounderProjectsRoutingModule {}
