import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VatReportPageRoutingModule } from './vat-report-routing.module';

import { VatReportPage } from './vat-report.page';
import { ComponentsModule } from '../../../modules/components.module';
import { MatModule } from 'src/app/modules/mat.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    MatModule,
    VatReportPageRoutingModule
  ],
  declarations: [VatReportPage]
})
export class VatReportPageModule {}
