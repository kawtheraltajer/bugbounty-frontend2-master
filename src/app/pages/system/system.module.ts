import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SystemPageRoutingModule } from './system-routing.module';

import { SystemPage } from './system.page';
import { PipesModule } from 'src/app/modules/pipes.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SystemPageRoutingModule,
    TranslateModule,
    PipesModule,
    TranslateModule
  ],
  declarations: [SystemPage]
})
export class SystemPageModule { }
