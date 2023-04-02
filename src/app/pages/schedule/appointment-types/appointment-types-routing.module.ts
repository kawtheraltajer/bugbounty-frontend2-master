import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppointmentTypesPage } from './appointment-types.page';

const routes: Routes = [
  {
    path: '',
    component: AppointmentTypesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppointmentTypesPageRoutingModule {}
