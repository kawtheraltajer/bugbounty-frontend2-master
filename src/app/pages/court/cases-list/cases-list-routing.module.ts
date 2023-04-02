import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CaseDetailssModal } from 'src/app/components/lists/case-list/case-list.component';

import {  CasesListPage } from './cases-list.page';

const routes: Routes = [
  {
    path: '',
    component: CasesListPage
  },
  {
    path: 'CaseDetails/:id',
    component: CaseDetailssModal, data: { noMenu: true }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CasesListPageRoutingModule {}
