import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PayrollPageRoutingModule } from './payroll-routing.module';
import { TranslateModule } from '@ngx-translate/core';

import { PayrollPage } from './payroll.page';
import { ComponentsModule } from 'src/app/modules/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    PayrollPageRoutingModule,
    TranslateModule
  ],
  declarations: [PayrollPage]
})
export class PayrollPageModule {}
