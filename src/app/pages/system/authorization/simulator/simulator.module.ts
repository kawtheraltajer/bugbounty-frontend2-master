import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SimulatorPageRoutingModule } from './simulator-routing.module';

import { SimulatorPage } from './simulator.page';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from 'src/app/modules/components.module';
import { MatModule } from 'src/app/modules/mat.module';
import { PipesModule } from 'src/app/modules/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule, MatModule, ComponentsModule,
    TranslateModule, PipesModule,
    SimulatorPageRoutingModule
  ],
  declarations: [SimulatorPage]
})
export class SimulatorPageModule { }
