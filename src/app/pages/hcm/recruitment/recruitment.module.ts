import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

import { RecruitmentPageRoutingModule } from './recruitment-routing.module';

import { RecruitmentPage } from './recruitment.page';
import { ComponentsModule } from 'src/app/modules/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecruitmentPageRoutingModule,
    ComponentsModule,
    TranslateModule
  ],
  declarations: [RecruitmentPage]
})
export class RecruitmentPageModule {}
