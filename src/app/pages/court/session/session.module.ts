import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PipesModule } from 'src/app/modules/pipes.module';

import { IonicModule } from '@ionic/angular';

import { SessionPageRoutingModule } from './session-routing.module';

import { SessionPage } from './session.page';

import { TranslateModule } from '@ngx-translate/core';
import { MatModule } from 'src/app/modules/mat.module';
import { ComponentsModule } from 'src/app/modules/components.module'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SessionPageRoutingModule,
    TranslateModule,
    MatModule,
    ComponentsModule,
    PipesModule

  ],
  declarations: [SessionPage]
})
export class SessionPageModule {}
