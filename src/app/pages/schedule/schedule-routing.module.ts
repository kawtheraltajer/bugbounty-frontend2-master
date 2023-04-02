import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SiteBookingComponent } from 'src/app/components/schedule/site-booking/site-booking.component';
import { AppointmentDetailsModal } from './appointments-table/appointments-table.page';

import { SchedulePage } from './schedule.page';

const routes: Routes = [
  {
    path: '',
    component: SchedulePage,
    children: [
      {
        path: '',
        redirectTo: 'appointments',
        pathMatch: 'full'
      },
      {
        path: 'timeSlots',
        loadChildren: () => import('./time-slots/time-slots.module').then(m => m.TimeSlotsPageModule)
      },
      {
        path: 'appointments',
        loadChildren: () => import('./appointments/appointments.module').then(m => m.AppointmentsPageModule)
      },
      {
        path: 'appointmentTypes',
        loadChildren: () => import('./appointment-types/appointment-types.module').then(m => m.AppointmentTypesPageModule)
      },
      // {
      //   path: 'booking',
      //   loadChildren: () => import('./booking/booking.module').then(m => m.BookingPageModule)
      // },
      {
        path: 'booking',
        component: SiteBookingComponent
      },
      {
        path: 'AppointmentsTable',
        loadChildren: () => import('./appointments-table/appointments-table.module').then(m => m.AppointmentsTablePageModule)
      },
      {
        path: 'appointmentDetails/:id',
        component: AppointmentDetailsModal
      }
    ]
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SchedulePageRoutingModule { }
