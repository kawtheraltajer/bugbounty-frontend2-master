import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CourtListPage } from './court-list.page';

const routes: Routes = [
  {
    path: '',
    component: CourtListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CourtListPageRoutingModule {}
