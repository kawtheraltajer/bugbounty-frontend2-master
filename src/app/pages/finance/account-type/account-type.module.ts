import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AccountTypePageRoutingModule } from './account-type-routing.module';

import { AccountTypePage } from './account-type.page';
import { ComponentsModule } from 'src/app/modules/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    AccountTypePageRoutingModule
  ],
  declarations: [AccountTypePage]
})
export class AccountTypePageModule {}
