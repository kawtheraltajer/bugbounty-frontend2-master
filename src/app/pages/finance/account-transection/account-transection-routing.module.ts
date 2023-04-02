import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AccountTransectionPage } from './account-transection.page';

const routes: Routes = [
  {
    path: '',
    component: AccountTransectionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountTransectionPageRoutingModule {}
