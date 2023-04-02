import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PermissionGuard } from 'src/app/auth/guards/permission.guard';
import { AuthorizationPage } from './authorization.page';

const routes: Routes = [
  {
    path: '',
    component: AuthorizationPage,
    children: [
      {
        path: '',
        redirectTo: 'users',
        pathMatch: 'full'
      },
      {
        path: 'users',
        loadChildren: () => import('./users/users.module').then(m => m.UsersPageModule),
       // canActivate: [PermissionGuard],
       // data: { roles: ['User:MANAGE'] }
      },
      {
        path: 'groups',
        loadChildren: () => import('./groups/groups.module').then(m => m.GroupsPageModule),
      //  canActivate: [PermissionGuard],
        //data: { roles: ['Group:MANAGE'] }
      },
     {
        path: 'permissions',
        loadChildren: () => import('./permissions/permissions.module').then(m => m.PermissionsPageModule),
      //  canActivate: [PermissionGuard],
      //  data: { roles: ['Permission:MANAGE'] }
      },
      {
        path: 'roles',
        loadChildren: () => import('./roles/roles.module').then(m => m.RolesPageModule),
      //  canActivate: [PermissionGuard],
       // data: { roles: ['Role:MANAGE'] }
      },
      {
        path: 'link',
        loadChildren: () => import('./link/link.module').then(m => m.LinkPageModule)
      },
      {
        path: 'simulator',
        loadChildren: () => import('./simulator/simulator.module').then(m => m.SimulatorPageModule)
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthorizationPageRoutingModule { }
