import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PermissionGuard } from 'src/app/auth/guards/permission.guard';

import { SystemPage } from './system.page';

const routes: Routes = [
  {
    path: '',
    component: SystemPage,
    children: [
      {
        path: '',
        redirectTo: 'authorization',
        pathMatch: 'full'
      },
      {
        path: 'authorization',
        loadChildren: () => import('./authorization/authorization.module').then(m => m.AuthorizationPageModule),
      },
      {
        path: 'logs',
        loadChildren: () => import('./logs/logs.module').then(m => m.LogsPageModule)
      }
    ]
  },
 ,

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SystemPageRoutingModule { }
