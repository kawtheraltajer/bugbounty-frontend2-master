import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DelayReasonPage } from './delay-reason.page';

const routes: Routes = [
  {
    path: '',
    component: DelayReasonPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DelayReasonPageRoutingModule {}
