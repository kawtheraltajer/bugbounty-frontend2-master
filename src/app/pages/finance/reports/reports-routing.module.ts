import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReportsPage } from './reports.page';

const routes: Routes = [
  {
    path: '',
    component: ReportsPage,
    children: [
      {
        path: 'income-expense',
        loadChildren: () => import('../income-expense-report/income-expense-report.module').then(m => m.IncomeExpenseReportPageModule)
      },
      {
        path: 'vat',
        loadChildren: () => import('../vat-report/vat-report.module').then(m => m.VatReportPageModule)
      },
      {
        path: 'balance-sheet',
        loadChildren: () => import('../balance-sheet/balance-sheet.module').then(m => m.BalanceSheetPageModule)
      }
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportsPageRoutingModule { }
