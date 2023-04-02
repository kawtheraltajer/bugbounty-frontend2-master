import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { ComponentsModule } from 'src/app/modules/components.module';

import { ChargeTypePageRoutingModule } from './charge-type-routing.module';

import { ChargeTypePage } from './charge-type.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChargeTypePageRoutingModule,
    ComponentsModule
  ],
  declarations: [ChargeTypePage]
})
export class ChargeTypePageModule {}
