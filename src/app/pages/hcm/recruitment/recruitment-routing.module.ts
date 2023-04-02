import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VacancyDetailsModal } from 'src/app/components/lists/vacancy-list/vacancy-list.component';

import { RecruitmentPage } from './recruitment.page';

const routes: Routes = [
  {
    path: '',
    component: RecruitmentPage
  },
  {
    path: 'vacancyDetails/:id',
    component: VacancyDetailsModal, data: { noMenu: true }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecruitmentPageRoutingModule {}
