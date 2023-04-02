import { EmployeeListComponent } from './../../../components/lists/employee-list/employee-list.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { IonicModule } from '@ionic/angular';

import { EmployeeManagementPageRoutingModule } from './employee-management-routing.module';
import { EmployeeManagementPage } from './employee-management.page';
import { MatModule } from 'src/app/modules/mat.module';
import { ComponentsModule } from 'src/app/modules/components.module';
import { PipesModule } from 'src/app/modules/pipes.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EmployeeManagementPageRoutingModule,
    MatModule,
    ComponentsModule,
    PipesModule,
    TranslateModule
    
  ],
  declarations: [EmployeeManagementPage ]
})
export class EmployeeManagementPageModule {}


