import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LeavesPageRoutingModule } from './leaves-routing.module';
import { LeavesPage } from './leaves.page';
import { MatModule } from 'src/app/modules/mat.module';
import { TranslateModule } from '@ngx-translate/core';

import{ ComponentsModule } from 'src/app/modules/components.module';
import { PipesModule } from 'src/app/modules/pipes.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LeavesPageRoutingModule,
    MatModule,
    ComponentsModule,
    TranslateModule,
    PipesModule
  ],
  declarations: [LeavesPage]
})
export class LeavesPageModule {}
