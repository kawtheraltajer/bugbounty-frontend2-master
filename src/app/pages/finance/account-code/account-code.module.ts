import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AccountCodePageRoutingModule } from './account-code-routing.module';

import { AccountCodePage } from './account-code.page';

import { ComponentsModule } from 'src/app/modules/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    AccountCodePageRoutingModule
  ],
  declarations: [AccountCodePage]
})
export class AccountCodePageModule {}
