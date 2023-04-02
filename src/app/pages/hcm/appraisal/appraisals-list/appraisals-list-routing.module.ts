import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppraisalsListPage } from './appraisals-list.page';

const routes: Routes = [
  {
    path: '',
    component: AppraisalsListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppraisalsListPageRoutingModule {}
