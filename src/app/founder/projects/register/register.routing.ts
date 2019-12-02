import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectRegisterOverviewComponent } from './overview/overview.component';
import { ProjectEntitySelectionComponent } from 'app/founder/projects/register/entity-selection/entity-selection.component';
import { RegistrationStageStorage } from 'app/founder/projects/register/questionnaire/RegistrationStageStorage';
import { StageComponent } from './stage/stage.component';
import { PlaceOrderComponent } from './stage/placeorder/placeorder.component';
import { ProjectregisteredComponent } from 'app/founder/projects/register/stage/projectregistered/projectregistered.component';


const routes: Routes = [
  {
    path: '',
    component: ProjectRegisterOverviewComponent,
  },
  {
    path: 'entity',
    component: ProjectEntitySelectionComponent,
  },
  {
    path: 'about_business',
    component: StageComponent,
    data: {
      title: 'About Business',
      subtitle: 'Let\'s explain your business.',
      stage: 'about_business',
      next: 'name_and_address'
    }
  },
  {
    path: 'name_and_address',
    component: StageComponent,
    data: {
      title: 'Name & Address',
      subtitle: 'Let\'s mention your contact details',
      stage: 'name_and_address',
      previous: 'about_business',
      next: 'owners_and_mgmt'
    }
  },
  {
    path: 'owners_and_mgmt',
    component: StageComponent,
    data: {
      title: 'Owners & Mgmt',
      subtitle: 'Owners & Mgmt Questions',
      stage: 'owners_and_mgmt',
      previous: 'name_and_address',
      next: 'tax_setup'
    }
  },
  {
    path: 'tax_setup',
    component: StageComponent,
    data: {
      title: 'Tax Setup',
      subtitle: 'Tax Setup Questions',
      stage: 'tax_setup',
      previous: 'owners_and_mgmt',
      next: 'business_setup'
    }
  },
  {
    path: 'business_setup',
    component: StageComponent,
    data: {
      title: 'Business Setup',
      subtitle: 'Business Setup Questions',
      stage: 'business_setup',
      previous: 'tax_setup',
      next:'placeorder'
    }
  },
  {
    path: 'placeorder',
    component: PlaceOrderComponent,
    data: {
      title: 'Place Order',
      subtitle: '',
      stage: 'placeorder',
      previous: 'business_setup'
    }
  },
  {
    path: 'projectregistered',
    component: ProjectregisteredComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers:[RegistrationStageStorage]
})
export class RegisterRoutingModule { }
