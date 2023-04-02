import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AppointmentsPageRoutingModule } from './appointments-routing.module';

import { AppointmentsPage } from './appointments.page';
import { ComponentsModule } from 'src/app/modules/components.module';
import { MatModule } from 'src/app/modules/mat.module';
import { PipesModule } from 'src/app/modules/pipes.module';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule, ComponentsModule,
    TranslateModule,
    MatModule, PipesModule,
    AppointmentsPageRoutingModule
  ],
  declarations: [AppointmentsPage]
})
export class AppointmentsPageModule { }
