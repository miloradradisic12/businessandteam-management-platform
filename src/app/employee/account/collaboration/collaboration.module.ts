import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {NgbCollapseModule,NgbPopoverModule,NgbTypeaheadModule} from '@ng-bootstrap/ng-bootstrap';
import {PerfectScrollbarModule} from 'ngx-perfect-scrollbar';

import { FileDroppa } from 'file-droppa/lib/index';
import {ProjectsService} from 'app/projects/projects.service';
import {ChatService} from 'app/collaboration/chat.service';
import {AppElementsModule} from 'app/elements/elements.module';
import {FolderNavigation} from 'app/elements/document-explorer/FolderNavigation';
import {DocumentsService} from 'app/projects/documents.service';
import {TasksService} from 'app/projects/tasks.service';

import { CollaborationComponent } from './collaboration.component';
import {DocumentChatComponent} from './chat/chat.component';
import {CollaborationDocumentComponent} from './document/document.component';
import {CollaborationGoalProcessesComponent} from './goal-processes/goal-processes.component';
import {CollaborationProcessDocumentsComponent} from './process-documents/process-documents.component';
import {SpreadSheetModule} from 'app/elements/spreadsheet/spreadsheet.module';
import {ChatParticipantsComponent} from './document-explorer/chat-participants/chat-participants.component';
import {DocumentTypeFilterComponent} from './document-explorer/document-type-filter/document-type-filter.component';
import { AttachSourceDrawingComponent } from './chat/attach-source-drawing/attach-source-drawing.component';
import { AssumptionSourceComponent } from './chat/assumption-source/assumption-source.component';
import { DecisionPollSourceComponent } from './chat/decision-poll-source/decision-poll-source.component';
import { ThoughtExperimentSourceComponent } from './chat/thought-experiment-source/thought-experiment-source.component';
import { HypothesisSourceComponent } from './chat/hypothesis-source/hypothesis-source.component';
import { StopTimerComponent } from './process-documents/stop-timer/stop-timer.component';
import { AppPipesModule } from 'app/pipes/pipes.module';
import { MyPrimeNgModule } from 'app/my-prime-ng.module';



@NgModule({
  imports: [
    CommonModule,
    AppElementsModule,
    AppPipesModule,
    NgbCollapseModule,
    NgbPopoverModule,
    NgbTypeaheadModule,
    FormsModule,
    RouterModule,
    SpreadSheetModule,
    FileDroppa,
    PerfectScrollbarModule.forChild(),
    MyPrimeNgModule
  ],
  declarations: [
    CollaborationComponent,
    CollaborationDocumentComponent,
    CollaborationGoalProcessesComponent,
    CollaborationProcessDocumentsComponent,
    DocumentChatComponent,
    ChatParticipantsComponent,
    DocumentTypeFilterComponent,
    AttachSourceDrawingComponent,
    AssumptionSourceComponent,
    DecisionPollSourceComponent,
    ThoughtExperimentSourceComponent,
    HypothesisSourceComponent,
    StopTimerComponent
  ],
  exports: [
    CollaborationComponent
  ],
  providers: [
    ProjectsService,
    ChatService,
    DocumentsService,
    FolderNavigation,
    TasksService
  ],
  entryComponents:[
    StopTimerComponent
  ]
})
export class CollaborationModule { }
