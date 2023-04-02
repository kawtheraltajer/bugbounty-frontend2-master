import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmployeeCentralPage } from './employee-central.page';

const routes: Routes = [
  {
    path: '',
    component: EmployeeCentralPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmployeeCentralPageRoutingModule {}
