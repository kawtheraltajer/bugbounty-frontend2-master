import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CaseTypesPage } from './case-types.page';

const routes: Routes = [
  {
    path: '',
    component: CaseTypesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CaseTypesPageRoutingModule {}
