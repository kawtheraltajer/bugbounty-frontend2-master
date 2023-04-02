import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NormalReportsPageRoutingModule } from './normal-reports-routing.module';

import { NormalReportsPage } from './normal-reports.page';
import { ComponentsModule } from 'src/app/modules/components.module';
import { TranslateModule } from '@ngx-translate/core';
import { MatModule } from 'src/app/modules/mat.module';
import { PipesModule } from 'src/app/modules/pipes.module';
import {ScrollingModule} from '@angular/cdk/scrolling';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NormalReportsPageRoutingModule,
    ComponentsModule,
    TranslateModule,
    MatModule,
    PipesModule,
    ScrollingModule
  ],
  declarations: [NormalReportsPage]
})
export class NormalReportsPageModule {}
