import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CompanyViewPageRoutingModule } from './company-view-routing.module';

import { CompanyViewPage } from './company-view.page';
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
    CompanyViewPageRoutingModule,
    ComponentsModule,
    TranslateModule,
    MatModule,
    PipesModule
  ],
  declarations: [CompanyViewPage]
})
export class CompanyViewPageModule {}
