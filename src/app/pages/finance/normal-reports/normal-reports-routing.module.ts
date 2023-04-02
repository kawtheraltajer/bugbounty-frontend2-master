import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NormalReportsPage } from './normal-reports.page';

const routes: Routes = [
  {
    path: '',
    component: NormalReportsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NormalReportsPageRoutingModule {}
