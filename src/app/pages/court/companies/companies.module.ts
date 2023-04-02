import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CompaniesPageRoutingModule } from './companies-routing.module';

import { CompaniesPage } from './companies.page';
import { TranslateModule } from '@ngx-translate/core';
import { MatModule } from 'src/app/modules/mat.module';

import { CustomModule } from 'src/app/modules/custom.module';
import { ComponentsModule } from 'src/app/modules/components.module';
import { PipesModule } from 'src/app/modules/pipes.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CompaniesPageRoutingModule,
    TranslateModule,
    MatModule,
    ComponentsModule,
    CustomModule,
    PipesModule

  ],
  declarations: [CompaniesPage]
})
export class CompaniesPageModule {}
