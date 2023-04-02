import { InvoiceDetailModal } from 'src/app/components/lists/invoice-list/invoice-list.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InvoicePage } from './invoice.page';

const routes: Routes = [
  {
    path: '',
    component: InvoicePage
  },
  {
    path: 'InvoiceDetails/:id',
    component: InvoiceDetailModal, data: { noMenu: true }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InvoicePageRoutingModule {}
