import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AppraisalPageRoutingModule } from './appraisal-routing.module';

import { AppraisalPage } from './appraisal.page';
import { MatModule } from 'src/app/modules/mat.module';
import { ComponentsModule } from 'src/app/modules/components.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MatModule,
    ComponentsModule,
    AppraisalPageRoutingModule,
    TranslateModule
  ],
  declarations: [AppraisalPage]
})
export class AppraisalPageModule { }
