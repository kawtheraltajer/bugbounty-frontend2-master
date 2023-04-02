import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IncomeExpenseReportPageRoutingModule } from './income-expense-report-routing.module';

import { IncomeExpenseReportPage } from './income-expense-report.page';
import { MatModule } from 'src/app/modules/mat.module';
import { ComponentsModule } from '../../../modules/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MatModule,
    ComponentsModule,
    IncomeExpenseReportPageRoutingModule
  ],
  declarations: [IncomeExpenseReportPage]
})
export class IncomeExpenseReportPageModule {}
