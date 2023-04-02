import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChargeTypePage } from './charge-type.page';

const routes: Routes = [
  {
    path: '',
    component: ChargeTypePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChargeTypePageRoutingModule {}
