import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppointmentsTablePage } from './appointments-table.page';

const routes: Routes = [
  {
    path: '',
    component: AppointmentsTablePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppointmentsTablePageRoutingModule {}
