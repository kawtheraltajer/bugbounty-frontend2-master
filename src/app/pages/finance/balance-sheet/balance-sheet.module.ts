import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BalanceSheetPageRoutingModule } from './balance-sheet-routing.module';

import { BalanceSheetPage } from './balance-sheet.page';
import { MatModule } from 'src/app/modules/mat.module';
import { ComponentsModule } from 'src/app/modules/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,  
    MatModule,
    ComponentsModule,
    BalanceSheetPageRoutingModule
  ],
  declarations: [BalanceSheetPage]
})
export class BalanceSheetPageModule {}
