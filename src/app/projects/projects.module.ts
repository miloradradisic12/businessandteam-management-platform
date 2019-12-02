import {NgModule} from '@angular/core';
import {FilterProjectStagePipe} from './pipes/filter-project-stage.pipe';
import {FilterVisiblePipe} from './pipes/filter-visible.pipe';
import {SearchProjectPipe} from './pipes/search-project.pipe';


@NgModule({
  exports: [
    FilterProjectStagePipe,
    FilterVisiblePipe,
    SearchProjectPipe
  ],
  declarations: [
    FilterProjectStagePipe,
    FilterVisiblePipe,
    SearchProjectPipe
  ]
})
export class AppProjectsModule {}
