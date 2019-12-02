import { NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {RealizationOverviewComponent} from './overview/overview.component';
import {StageComponent} from './stage/stage.component';


const routes: Routes = [
  {
    path: '',
    component: RealizationOverviewComponent,
  },
  {
    path: 'express',
    component: StageComponent,
    data: {
      title: 'Express',
      subtitle: 'Let\'s get the foundations right.',
      stage: 'express',
      next: 'develop'
    }
  },
  {
    path: 'develop',
    component: StageComponent,
    data: {
      title: 'Develop',
      subtitle: 'Let\'s expand that idea into something that is business oriented',
      stage: 'develop',
      previous: 'express',
      next: 'visual'
    }
  },
  {
    path: 'visual',
    component: StageComponent,
    data: {
      title: 'Visual',
      subtitle: 'Lorem ipsum dolor sit nuis que',
      stage: 'visual',
      previous: 'develop',
      next: 'target'
    }
  },
  {
    path: 'target',
    component: StageComponent,
    data: {
      title: 'Target',
      subtitle: 'Lorem ipsum dolor sit nuis que',
      stage: 'target',
      previous: 'visual',
      next: 'plan'
    }
  },
  {
    path: 'plan',
    component: StageComponent,
    data: {
      title: 'Plan',
      subtitle: 'Lorem ipsum dolor sit nuis que',
      stage: 'plan',
      previous: 'target'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IdeaRealizationRoutingModule {}
