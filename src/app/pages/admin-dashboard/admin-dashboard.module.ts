import { AdminDashboardPageRoutingModule } from './admin-dashboard-routing.module';
import { AdminDashboardPage } from './admin-dashboard.page';
import { EmployeeListComponent } from '../../components/lists/employee-list/employee-list.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
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
    AdminDashboardPageRoutingModule
  ],
  declarations: [AdminDashboardPage]
})
export class AdminDashboardPageModule { }
