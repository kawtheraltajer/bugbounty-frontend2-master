import { EmployeeListComponent } from './../../components/lists/employee-list/employee-list.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DashboardPageRoutingModule } from './dashboard-routing.module';
import { DashboardPage } from './dashboard.page';
import { MatModule } from 'src/app/modules/mat.module';
import { ComponentsModule } from 'src/app/modules/components.module';
import { EditorModule } from '@tinymce/tinymce-angular';
import { PipesModule } from 'src/app/modules/pipes.module';
import { TranslateModule } from '@ngx-translate/core';
import { DirectivesModule } from 'src/app/modules/directives.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MatModule, PipesModule, ComponentsModule, TranslateModule, DirectivesModule,
    EditorModule,
    DashboardPageRoutingModule
  ],
  declarations: [DashboardPage]
})
export class DashboardPageModule { }
