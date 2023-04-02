import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppraisalPage } from './appraisal.page';

const routes: Routes = [
  {
    path: '',
    component: AppraisalPage,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardPageModule)
      },
      {
        path: 'types',
        loadChildren: () => import('./types/types.module').then(m => m.TypesPageModule)
      },
      {
        path: 'templates',
        loadChildren: () => import('./templates/templates.module').then(m => m.TemplatesPageModule)
      },
      {
        path: 'list',
        loadChildren: () => import('./appraisals-list/appraisals-list.module').then(m => m.AppraisalsListPageModule)
      },
    ]
  },
  {
    path: 'details/:id',
    loadChildren: () => import('./details/details.module').then(m => m.DetailsPageModule)
  },
  {
    path: 'template/:id',
    loadChildren: () => import('./template/template.module').then(m => m.TemplatePageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppraisalPageRoutingModule { }
