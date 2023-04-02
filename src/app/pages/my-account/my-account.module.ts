import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyAccountPageRoutingModule } from './my-account-routing.module';

import { MyAccountPage } from './my-account.page';
import { MatModule } from 'src/app/modules/mat.module';
import { PipesModule } from 'src/app/modules/pipes.module';
import { ComponentsModule } from 'src/app/modules/components.module';
import { TranslateModule } from '@ngx-translate/core';
import { DirectivesModule } from 'src/app/modules/directives.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyAccountPageRoutingModule,
    TranslateModule,
    MatModule,
    PipesModule,
    DirectivesModule,
    ComponentsModule
  ],
  declarations: [MyAccountPage]
})
export class MyAccountPageModule { }
