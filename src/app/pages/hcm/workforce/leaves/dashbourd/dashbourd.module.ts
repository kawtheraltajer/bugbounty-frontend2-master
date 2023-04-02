import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { IonicModule } from '@ionic/angular';

import { DashbourdPageRoutingModule } from './dashbourd-routing.module';
import { MatModule } from 'src/app/modules/mat.module';

import { DashbourdPage } from './dashbourd.page';
import { PipesModule } from 'src/app/modules/pipes.module';
import { MatTableExporterModule } from 'mat-table-exporter';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    DashbourdPageRoutingModule,
    MatModule,
    TranslateModule,
    FormsModule,
    IonicModule,
    PipesModule,
    MatTableExporterModule
  ],
  declarations: [DashbourdPage]
})
export class DashbourdPageModule {}
