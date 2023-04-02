import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LinkPageRoutingModule } from './link-routing.module';

import { LinkPage } from './link.page';
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
    LinkPageRoutingModule
  ],
  declarations: [LinkPage]
})
export class LinkPageModule { }
