import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyAppointmentsPageRoutingModule } from './my-appointments-routing.module';

import { MyAppointmentsPage } from './my-appointments.page';
import { PipesModule } from 'src/app/modules/pipes.module';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from 'src/app/modules/components.module';
import { MatModule } from 'src/app/modules/mat.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule, PipesModule, ComponentsModule, MatModule,
    MyAppointmentsPageRoutingModule
  ],
  declarations: [MyAppointmentsPage]
})
export class MyAppointmentsPageModule { }
