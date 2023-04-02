import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AccountCodePage } from './account-code.page';

const routes: Routes = [
  {
    path: '',
    component: AccountCodePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountCodePageRoutingModule {}
