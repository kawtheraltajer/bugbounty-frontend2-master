import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { EmployeeSelfServicePageRoutingModule } from './employee-self-service-routing.module';
import { EmployeeSelfServicePage } from './employee-self-service.page';
import { MatModule } from 'src/app/modules/mat.module';
import { ComponentsModule } from 'src/app/modules/components.module';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MatModule,
    ComponentsModule,
    EmployeeSelfServicePageRoutingModule,
    TranslateModule
    //TranslateModule

  ],
  declarations: [EmployeeSelfServicePage]
})
export class EmployeeSelfServicePageModule { }
