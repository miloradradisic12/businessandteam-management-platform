import { NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {KanbanboardNewGoalComponent} from './newgoal/newgoal.component';
import {KanbanboardEditGoalComponent} from './editgoal/editgoal.component';
import {KanbanboardComponent} from './home/kanbanboard.component';
import {IsRegularUser} from 'app/auth/permissions';


const routes: Routes = [
  {
    path: 'newgoal',
    component: KanbanboardNewGoalComponent
  }, {
    path: 'editgoal/:goalId',
    component: KanbanboardEditGoalComponent
  }, {
    path: '',
    component: KanbanboardComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KanbanboardRoutingModule {}
