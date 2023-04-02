import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BalancePageRoutingModule } from './balance-routing.module';

import { BalancePage } from './balance.page';
import { MatModule } from 'src/app/modules/mat.module';
import { ComponentsModule } from 'src/app/modules/components.module';



import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from 'src/app/modules/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BalancePageRoutingModule,
    MatModule,
    ComponentsModule,
    TranslateModule,
    PipesModule
  ],
  declarations: [BalancePage]
})
export class BalancePageModule {}
