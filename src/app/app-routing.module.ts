import { SiteVacancyComponent, AddApplicationSiteModal } from './components/vacancy/site-vacancy/site-vacancy.component';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { PermissionGuard } from './auth/guards/permission.guard';
import { UserGuard } from './auth/guards/user.guard';
import { SiteBookingComponent } from './components/schedule/site-booking/site-booking.component';
import { ClientViewPage } from './pages/court/client-view/client-view.page';
import { CaseDetailssModal } from './components/lists/case-list/case-list.component';
import { TermsPage } from './pages/schedule/terms/terms.page';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/auth/login/login.module').then(m => m.LoginPageModule)
  },
  
  {
    path: 'dashboard',
    loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardPageModule),
    canActivate: [UserGuard]
  },
  {
    path: 'admin-dashboard',
    loadChildren: () => import('./pages/admin-dashboard/admin-dashboard.module').then(m => m.AdminDashboardPageModule),


  
  },
  // {
  //   path: '**',
  //   loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardPageModule),
  //   canActivate: [UserGuard]
  // },
  {
    path: 'court',
    loadChildren: () => import('./pages/court/court.module').then(m => m.CourtPageModule),
    canActivate: [UserGuard]
  },
  {
    path: 'system',
    loadChildren: () => import('./pages/system/system.module').then(m => m.SystemPageModule),
    canActivate: [UserGuard]
  },
  {
    path: 'myaccount',
    loadChildren: () => import('./pages/my-account/my-account.module').then(m => m.MyAccountPageModule),
    canActivate: [UserGuard]
  },
  {
    path: 'tasks',
    loadChildren: () => import('./pages/tasks/tasks.module').then(m => m.TasksPageModule),
    canActivate: [UserGuard]
  //  canActivate: [PermissionGuard],
   // data: { roles: ['Task:READ'] }
  },
  {
    path: 'tasks/:id',
    loadChildren: () => import('./pages/tasks/tasks.module').then(m => m.TasksPageModule),
    canActivate: [UserGuard]
  //  canActivate: [PermissionGuard],
   // data: { roles: ['Task:READ'] }
  },
  {
    path: 'schedule',
    loadChildren: () => import('./pages/schedule/schedule.module').then(m => m.SchedulePageModule),
    canActivate: [UserGuard]
    // canActivate: [PermissionGuard],
    // data: { roles: ['Appointment:MANAGE'] }
  },
  {
    path: 'forgetpassword/:jwt',
    loadChildren: () => import('./pages/auth/forget-password/forget-password.module').then(m => m.ForgetPasswordPageModule)
  },
  {
    path: 'forgetpassword',
    loadChildren: () => import('./pages/auth/forget-password/forget-password.module').then(m => m.ForgetPasswordPageModule)
  },
  {
    path: 'myappointments',
    loadChildren: () => import('./pages/my-appointments/my-appointments.module').then(m => m.MyAppointmentsPageModule),
    canActivate: [UserGuard]
  },
  {
    path: 'hcm',
    loadChildren: () => import('./pages/hcm/hcm.module').then(m => m.HcmPageModule),
    canActivate: [UserGuard]
  },
  {
    path: 'finance',
    loadChildren: () => import('./pages/finance/finance.module').then(m => m.FinancePageModule),
    canActivate: [UserGuard]
  },
  {
    path: 'employee-self-service',
    loadChildren: () => import('./pages/employee-self-service/employee-self-service.module').then(m => m.EmployeeSelfServicePageModule),
    canActivate: [UserGuard]
  },
  //Site pages 
  {
    path: 'newBooking',
    component: SiteBookingComponent, data: { noMenu: true }
  },
    //Site pages 
    {
      path: 'terms',
      component: TermsPage, data: { noMenu: true }
    },
  {
    path: 'jobs',
    component: SiteVacancyComponent, data: { noMenu: true }
  },
  {
    path: 'jobs/:id',
    component: AddApplicationSiteModal, data: { noMenu: true }
  },
  {
    path: 'announcement',
    loadChildren: () => import('./pages/announcement/announcement.module').then( m => m.AnnouncementPageModule),
    canActivate: [UserGuard]
  },
  {
    path: 'preview-doc',
    loadChildren: () => import('./preview-doc/preview-doc.module').then( m => m.PreviewDocPageModule),
    canActivate: [UserGuard]
  },
  {
    path: 'ClientViewPage',
    loadChildren: () => import('./pages/court/client-view/client-view.module').then( m => m.ClientViewPageModule),
    canActivate: [UserGuard]
  },
  {
    path: 'book-appointment',
    component: SiteBookingComponent
  },
  {
    path: 'CompanyViewPage',
    loadChildren: () => import('./pages/court/company-view/company-view.module').then( m => m.CompanyViewPageModule),
    canActivate: [UserGuard]
  },
  {
    path: 'CaseDetails/:id',
    component: CaseDetailssModal, data: { noMenu: true },
    canActivate: [UserGuard]
  }




];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, initialNavigation: 'enabled', relativeLinkResolution: 'legacy' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
