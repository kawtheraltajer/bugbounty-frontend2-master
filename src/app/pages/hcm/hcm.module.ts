import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HcmPageRoutingModule } from './hcm-routing.module';

import { HcmPage } from './hcm.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HcmPageRoutingModule
  ],
  declarations: [HcmPage]
})
export class HcmPageModule {}
