import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AccountTransectionPageRoutingModule } from './account-transection-routing.module';

import { AccountTransectionPage } from './account-transection.page';
import { ComponentsModule } from '../../../modules/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    AccountTransectionPageRoutingModule
  ],
  declarations: [AccountTransectionPage]
})
export class AccountTransectionPageModule {}
