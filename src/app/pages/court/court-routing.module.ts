import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CourtPage } from './court.page';




const routes: Routes = [
  {
    path: '',
    component: CourtPage,
    children: [
      {
        path: 'cases-list',
        loadChildren: () => import('./cases-list/cases-list.module').then(m => m.CasesListPageModule)
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashbourdPageModule)
      },

      {
        path: 'case-types',
        loadChildren: () => import('./case-types/case-types.module').then(m => m.CaseTypesPageModule)
      },
      {
        path: 'delay-reason',
        loadChildren: () => import('./delay-reason/delay-reason.module').then(m => m.DelayReasonPageModule)
      },
      {
        path: 'requests',
        loadChildren: () => import('./requests/requests.module').then(m => m.RequestsPageModule)
      }, {
        path: 'clients',
        loadChildren: () => import('./clients/clients.module').then(m => m.ClientsPageModule)
      },
      {
        path: 'companies',
        loadChildren: () => import('./companies/companies.module').then(m => m.CompaniesPageModule)
      }, {
        path: 'session',
        loadChildren: () => import('./session/session.module').then(m => m.SessionPageModule)
      },
      {
        path: 'reports',
        loadChildren: () => import('./reports/reports.module').then(m => m.ReportsPageModule)
      },
      {
        path: 'reports/:id',
        loadChildren: () => import('./reports/reports.module').then(m => m.ReportsPageModule)
      },
      {
        path: 'agenda',
        loadChildren: () => import('./agenda/agenda.module').then(m => m.AgendaPageModule)
      },
      {
        path: 'agenda/:id',
        loadChildren: () => import('./agenda/agenda.module').then(m => m.AgendaPageModule)
      },
      {
        path: 'charge-type',
        loadChildren: () => import('./charge-type/charge-type.module').then(m => m.ChargeTypePageModule)
      },
      {
        path: '',
        loadChildren: () => import('./agenda/agenda.module').then(m => m.AgendaPageModule)
      },
      {
        path: 'court-list',
        loadChildren: () => import('./court-list/court-list.module').then(m => m.CourtListPageModule)
      },

    ]
  },
  {
    path: 'client-view',
    loadChildren: () => import('./client-view/client-view.module').then(m => m.ClientViewPageModule)
  },
  {
    path: 'company-view',
    loadChildren: () => import('./company-view/company-view.module').then(m => m.CompanyViewPageModule)
  }




];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CourtPageRoutingModule { }
