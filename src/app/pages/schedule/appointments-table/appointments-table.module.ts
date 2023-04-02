import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AppointmentsTablePageRoutingModule } from './appointments-table-routing.module';

import { AppointmentsTablePage } from './appointments-table.page';
import { MatModule } from 'src/app/modules/mat.module';
import { PipesModule } from 'src/app/modules/pipes.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AppointmentsTablePageRoutingModule,
    MatModule,
    PipesModule,
    TranslateModule
  ],
  declarations: [AppointmentsTablePage]
})
export class AppointmentsTablePageModule {}
