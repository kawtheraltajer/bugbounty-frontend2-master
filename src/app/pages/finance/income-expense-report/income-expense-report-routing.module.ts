import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IncomeExpenseReportPage } from './income-expense-report.page';

const routes: Routes = [
  {
    path: '',
    component: IncomeExpenseReportPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IncomeExpenseReportPageRoutingModule {}
