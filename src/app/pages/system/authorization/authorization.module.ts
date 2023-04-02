import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AuthorizationPageRoutingModule } from './authorization-routing.module';

import { AuthorizationPage } from './authorization.page';
import { MatModule } from 'src/app/modules/mat.module';
import { ComponentsModule } from 'src/app/modules/components.module';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from 'src/app/modules/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MatModule, ComponentsModule,
    TranslateModule, PipesModule,
    AuthorizationPageRoutingModule
  ],
  declarations: [AuthorizationPage]
})
export class AuthorizationPageModule { }
