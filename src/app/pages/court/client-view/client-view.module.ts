import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClientViewPageRoutingModule } from './client-view-routing.module';
import { ComponentsModule } from 'src/app/modules/components.module';
import { TranslateModule } from '@ngx-translate/core';
import { MatModule } from 'src/app/modules/mat.module';
import { PipesModule } from 'src/app/modules/pipes.module';
import {ScrollingModule} from '@angular/cdk/scrolling';

import { ClientViewPage } from './client-view.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClientViewPageRoutingModule,
    ComponentsModule,
    TranslateModule,
    MatModule,
    PipesModule,
    ScrollingModule
  ],
  declarations: [ClientViewPage]
})
export class ClientViewPageModule {}
