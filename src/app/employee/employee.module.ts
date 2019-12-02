import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeRoutingModule } from './employee.routing';
import { AccountComponent } from './account/account.component';
import {NavbarModule} from '../core/navbar/navbar.module';
import { EmployeeComponent } from './employee.component';
import {NgbDropdownModule, NgbPopoverModule} from '@ng-bootstrap/ng-bootstrap';
import {AppElementsModule} from '../elements/elements.module';
import {MyPrimeNgModule} from '../my-prime-ng.module';

@NgModule({
  imports: [
    CommonModule,
    NavbarModule,
    EmployeeRoutingModule,
    NgbDropdownModule,
    NgbPopoverModule,
    AppElementsModule,
    MyPrimeNgModule
  ],
  declarations: [AccountComponent,EmployeeComponent]
})
export class EmployeeModule { }
