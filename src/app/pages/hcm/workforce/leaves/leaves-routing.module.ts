import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LeavesPage } from './leaves.page';

const routes: Routes = [
  {
    path: '',
    component: LeavesPage,

    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashbourd',
        loadChildren: () => import('./dashbourd/dashbourd.module').then( m => m.DashbourdPageModule)
      },
      {
        path: 'leave-types',
        loadChildren: () => import('./leave-types/leave-types.module').then( m => m.LeaveTypesPageModule)
      },  {
    path: 'holiday',
    loadChildren: () => import('./holiday/holiday.module').then( m => m.HolidayPageModule)
  } ,{
    path: 'balance',
    loadChildren: () => import('./balance/balance.module').then( m => m.BalancePageModule)
  },

    ]
  },
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LeavesPageRoutingModule {}
