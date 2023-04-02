import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TimeSlotsPageRoutingModule } from './time-slots-routing.module';

import { TimeSlotsPage } from './time-slots.page';
import { MatModule } from 'src/app/modules/mat.module';
import { ComponentsModule } from 'src/app/modules/components.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MatModule, ComponentsModule, TranslateModule,
    TimeSlotsPageRoutingModule
  ],
  declarations: [TimeSlotsPage]
})
export class TimeSlotsPageModule { }
