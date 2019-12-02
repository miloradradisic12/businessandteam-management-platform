

import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {TestComponent} from'./test.component';
import {TestRoutingModule} from './test.routing';
import {MyPrimeNgModule} from '../my-prime-ng.module';
import { AppElementsModule } from '../elements/elements.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TestRoutingModule,
    AppElementsModule,
    MyPrimeNgModule
  ],
  declarations: [
    TestComponent
  ]
})

export class TestModule {}
