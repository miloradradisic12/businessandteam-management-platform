import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

import {NavbarModule} from './navbar/navbar.module';
import {KanbanboardRoutingModule} from './kanbanboard.routing';
import {KanbanboardNewGoalComponent} from './newgoal/newgoal.component';
import {KanbanboardEditGoalComponent} from './editgoal/editgoal.component';
import {KanbanboardComponent} from './home/kanbanboard.component';
import {DynamicKanbanboardComponent} from './dynamic-kanbanboard/dynamickanbanboard.component';
import {DynamicKanbanboardEditComponent} from './dynamic-kanbanboard-edit/edit_dynamickanbanboard.component';
import {jqxKanbanComponent} from 'jqwidgets-framework/jqwidgets-ts/angular_jqxkanban';
import {AppPipesModule} from 'app/pipes/pipes.module';

import {NgbDropdownModule, NgbPopoverModule} from '@ng-bootstrap/ng-bootstrap';
import {ProcessComponent} from './newgoal/processDirective/process.component';
import {ProcessParticipantsComponent} from './newgoal/processDirective/process-participants/process-partcipants.component';
import {AppElementsModule} from 'app/elements/elements.module';
import { DependencyComponent } from './newgoal/dependency/dependency.component';
import {DropdownModule} from 'primeng/primeng';


@NgModule({
  imports: [
    CommonModule,
    NavbarModule,
    KanbanboardRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbDropdownModule,
    NgbPopoverModule,
    AppElementsModule,
    AppPipesModule,
    DropdownModule
  ],
  declarations: [
    KanbanboardNewGoalComponent,
    KanbanboardEditGoalComponent,
    KanbanboardComponent,
    DynamicKanbanboardComponent,
    DynamicKanbanboardEditComponent,
    ProcessComponent,
    ProcessParticipantsComponent,
    jqxKanbanComponent,
    DependencyComponent
  ]
})
export class KanbanboardModule {}
