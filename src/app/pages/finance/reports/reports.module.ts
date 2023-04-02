import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { FinanceService } from 'src/app/services/finance.service';

import { ReportsPageRoutingModule } from './reports-routing.module';

import { ReportsPage } from './reports.page';
import { ComponentsModule } from 'src/app/modules/components.module';
import { TranslateModule } from '@ngx-translate/core';

import { MatModule } from 'src/app/modules/mat.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    ReportsPageRoutingModule,
    MatModule,
    TranslateModule
  ],
  declarations: [ReportsPage]
})
export class ReportsPageModule {}
