import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClientsPage, ClientDetailsModal } from './clients.page';

const routes: Routes = [
  {
    path: '',
    component: ClientsPage
  },
  {
    path: 'client-details/:id',
    component: ClientDetailsModal,
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientsPageRoutingModule {}
