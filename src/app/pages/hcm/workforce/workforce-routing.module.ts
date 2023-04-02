import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WorkforcePage } from './workforce.page';

const routes: Routes = [
  {
    path: '',
    component: WorkforcePage,
  },
  {
    path: 'leaves',
    loadChildren: () => import('./leaves/leaves.module').then(m => m.LeavesPageModule)
  }
  ]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WorkforcePageRoutingModule { }
