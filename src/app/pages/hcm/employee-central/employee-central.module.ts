import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EmployeeCentralPageRoutingModule } from './employee-central-routing.module';

import { EmployeeCentralPage } from './employee-central.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EmployeeCentralPageRoutingModule
  ],
  declarations: [EmployeeCentralPage]
})
export class EmployeeCentralPageModule {}
