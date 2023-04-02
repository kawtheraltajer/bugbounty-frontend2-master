import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CasesListPageRoutingModule } from './cases-list-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { CasesListPage } from './cases-list.page';
import { MatModule } from 'src/app/modules/mat.module';
import { PipesModule } from 'src/app/modules/pipes.module';
import { ComponentsModule } from 'src/app/modules/components.module';
import {ScrollingModule} from '@angular/cdk/scrolling';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CasesListPageRoutingModule,
    TranslateModule,
    MatModule,
    PipesModule,
    ComponentsModule,
    ScrollingModule
  ],
  declarations: [CasesListPage]
})
export class CasesListPageModule {}
