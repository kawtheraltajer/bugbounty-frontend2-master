import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CompaniesPage, CompanyDetailsModal } from './companies.page';

const routes: Routes = [
  {
    path: '',
    component: CompaniesPage
  },
  {
    path: 'company-details/:id',
    component: CompanyDetailsModal,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompaniesPageRoutingModule {}
