import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TypesPageRoutingModule } from './types-routing.module';

import { TypesPage } from './types.page';
import { MatModule } from 'src/app/modules/mat.module';
import { PipesModule } from 'src/app/modules/pipes.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MatModule,
    PipesModule,
    TranslateModule,
    TypesPageRoutingModule
  ],
  declarations: [TypesPage]
})
export class TypesPageModule { }
