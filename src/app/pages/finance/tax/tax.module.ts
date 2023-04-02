import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TaxPageRoutingModule } from './tax-routing.module';

import { TaxPage } from './tax.page';
import { MatModule } from 'src/app/modules/mat.module';
import { ComponentsModule } from 'src/app/modules/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MatModule,
    ComponentsModule,
    TaxPageRoutingModule
  ],
  declarations: [TaxPage]
})
export class TaxPageModule {}
