import { SiteBookingComponent } from './../../components/schedule/site-booking/site-booking.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HcmPage } from './hcm.page';
import { EmployeeRequestsListComponent } from 'src/app/components/lists/employee-requests-list/employee-requests-list.component';

const routes: Routes = [
  {
    path: '',
    component: HcmPage,
  },
  {
    path: 'employee-central',
    loadChildren: () => import('./employee-central/employee-central.module').then(m => m.EmployeeCentralPageModule)
  },
  {
    path: 'recruitment',
    loadChildren: () => import('./recruitment/recruitment.module').then(m => m.RecruitmentPageModule)
  },
  {
    path: 'payroll',
    loadChildren: () => import('./payroll/payroll.module').then(m => m.PayrollPageModule)
  },
  {
    path: 'appraisal',
    loadChildren: () => import('./appraisal/appraisal.module').then(m => m.AppraisalPageModule)
  },
  {
    path: 'workforce',
    loadChildren: () => import('./workforce/workforce.module').then( m => m.WorkforcePageModule)
  },
  {
    path: 'employee-management',
    loadChildren: () => import('./employee-management/employee-management.module').then( m => m.EmployeeManagementPageModule)
  },
  {
    path: 'employee-requests-list',
    component: EmployeeRequestsListComponent, data: { noMenu: false }
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HcmPageRoutingModule { }
