import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ComponentsModule } from 'src/app/modules/components.module';
import { IonicModule } from '@ionic/angular';
import { ReportsPageRoutingModule } from './reports-routing.module';
import { ReportsPage } from './reports.page';
import { MatTableModule } from '@angular/material/table' 
import { TranslateModule } from '@ngx-translate/core';
import { MatModule } from 'src/app/modules/mat.module';
import { MatTableExporterModule } from 'mat-table-exporter';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReportsPageRoutingModule,
    ComponentsModule,
    MatTableModule,
    TranslateModule,
    MatModule,
    MatTableExporterModule

  ],
  declarations: [ReportsPage]
})
export class ReportsPageModule {}
