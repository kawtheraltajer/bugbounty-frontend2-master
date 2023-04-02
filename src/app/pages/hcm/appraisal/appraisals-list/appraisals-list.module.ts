import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AppraisalsListPageRoutingModule } from './appraisals-list-routing.module';

import { AppraisalsListPage } from './appraisals-list.page';
import { TranslateModule } from '@ngx-translate/core';
import { MatModule } from 'src/app/modules/mat.module';
import { PipesModule } from 'src/app/modules/pipes.module';
import { ComponentsModule } from 'src/app/modules/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MatModule,
    ComponentsModule,
    PipesModule,
    TranslateModule,
    AppraisalsListPageRoutingModule
  ],
  declarations: [AppraisalsListPage]
})
export class AppraisalsListPageModule { }
