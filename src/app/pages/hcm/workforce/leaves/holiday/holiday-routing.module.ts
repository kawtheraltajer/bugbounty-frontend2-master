import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HolidayPage } from './holiday.page';

const routes: Routes = [
  {
    path: '',
    component: HolidayPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HolidayPageRoutingModule {}
