import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
//import { AddEmployeeRequestModal } from '../hcm/employee-request/employee-request.page';
import { LeavesPageModule } from '../hcm/workforce/leaves/leaves.module';

import { ContractsPage, EmployeeSelfServicePage, PersonalInformationPage, EmployeeLeavePage, TalentPage ,EmployeeReportsPage, BankInfonPage} from './employee-self-service.page';

const routes: Routes = [
  {
    path: '',
    component: EmployeeSelfServicePage
  },

{
      path: 'PersonalInfromation',
      component: PersonalInformationPage, data: { noMenu: false }
    },
    {
      path: 'TalentPage',
      component: TalentPage, data: { noMenu: false }
    },
    {
      path: 'ContractsPage',
      component: ContractsPage, data: { noMenu: false }
    },
    {
      path: 'EmployeeLeavePage',
      component: EmployeeLeavePage, data: { noMenu: false }
    },
    {
      path: 'leave-type',
      component: LeavesPageModule, data: { noMenu: false }
    },
    {
      path: 'EmployeeReportsPage',
      component: EmployeeReportsPage, data: { noMenu: false }
    }
    ,
    {
      path: 'BankInfo',
      component: BankInfonPage, data: { noMenu: false }
    }
    
    /*,
    {
      path: 'employee-request',
      component: AddEmployeeRequestModal, data: { noMenu: false }
    }*/
  


  ]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmployeeSelfServicePageRoutingModule {}
