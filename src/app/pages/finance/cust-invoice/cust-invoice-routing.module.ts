import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CustInvoicePage } from './cust-invoice.page';

const routes: Routes = [
  {
    path: '',
    component: CustInvoicePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustInvoicePageRoutingModule {}
