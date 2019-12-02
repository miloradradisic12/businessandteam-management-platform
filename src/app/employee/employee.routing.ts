import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//import { EditComponent } from './account/edit/edit.component'
//import { IsEmployeeProfileComplete } from 'app/auth/permissions';
import { EmployeeComponent } from './employee.component';
import { FindWorkComponent } from 'app/employee/account/find-work/find-work.component';
//import { StageStorage as EmployeeService } from 'app/employeeprofile/stage-storage.service'

const routes: Routes = [
  {
    path: '',
    component: EmployeeComponent,
  //  loadChildren:'./account/account.module#AccountModule',
  },
  {
    path: 'account',
    //component: EditComponent,
    loadChildren:'./account/account.module#AccountModule',
    //canActivate:[IsEmployeeProfileComplete]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers:[]
})
export class EmployeeRoutingModule { }
