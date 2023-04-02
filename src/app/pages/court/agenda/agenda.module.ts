import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AgendaPageRoutingModule } from './agenda-routing.module';
import { AgendaPage } from './agenda.page';
import { ComponentsModule } from 'src/app/modules/components.module';
import { MatTableModule } from '@angular/material/table' 
import { TranslateModule } from '@ngx-translate/core';
import { MatModule } from 'src/app/modules/mat.module';
import { MatTableExporterModule } from 'mat-table-exporter';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AgendaPageRoutingModule,
    TranslateModule,
    ComponentsModule,
    MatTableModule,
    MatModule,
    MatTableExporterModule,
  ],
  declarations: [AgendaPage]
})
export class AgendaPageModule {}
