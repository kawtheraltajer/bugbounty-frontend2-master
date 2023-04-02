import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LeaveTypesPage } from './leave-types.page';

const routes: Routes = [
  {
    path: '',
    component: LeaveTypesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LeaveTypesPageRoutingModule {}
