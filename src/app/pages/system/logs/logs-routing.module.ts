import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LogDetailModal } from 'src/app/components/lists/logs-list/logs-list.component';

import { LogsPage } from './logs.page';

const routes: Routes = [
  {
    path: '',
    component: LogsPage
  },
  {
    path: 'details/:id',
    component: LogDetailModal, data: { noMenu: true }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LogsPageRoutingModule {}
