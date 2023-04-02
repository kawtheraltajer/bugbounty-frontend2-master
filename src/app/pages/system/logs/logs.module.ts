import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LogsPageRoutingModule } from './logs-routing.module';
import { ComponentsModule } from 'src/app/modules/components.module';

import { MatTableExporterModule } from 'mat-table-exporter';
import { LogsPage } from './logs.page';
import { MatModule } from 'src/app/modules/mat.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LogsPageRoutingModule,
    MatModule,
    TranslateModule,
    ComponentsModule,
    MatTableExporterModule
  ],
  declarations: [LogsPage]
})
export class LogsPageModule { }
