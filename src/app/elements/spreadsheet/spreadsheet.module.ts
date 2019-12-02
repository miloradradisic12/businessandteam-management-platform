import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import { FormsModule } from '@angular/forms';
import {SpreadsheetComponent} from './spreadsheet.component';
import {ContextMenuComponent} from './sheet-context-menu/contextmenu.component';
import { DataSvc } from './services/DataSvc';
import { WjGridSheetModule } from 'wijmo/wijmo.angular2.grid.sheet';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    WjGridSheetModule
  ],
  declarations: [
    SpreadsheetComponent,
    ContextMenuComponent
  ],
  exports: [
    SpreadsheetComponent,
  ],
  providers: [
    DataSvc
  ]
})
export class SpreadSheetModule {}

