import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmployeeDetailsModal } from 'src/app/components/lists/employee-list/employee-list.component';

import { EmployeeManagementPage } from './employee-management.page';

const routes: Routes = [
  {
    path: '',
    component: EmployeeManagementPage
  },
  {
    path: 'employeeDetails/:id',
    component: EmployeeDetailsModal, data: { noMenu: true }
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmployeeManagementPageRoutingModule {}
