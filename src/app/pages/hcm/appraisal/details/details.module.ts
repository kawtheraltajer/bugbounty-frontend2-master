import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailsPageRoutingModule } from './details-routing.module';

import { DetailsPage } from './details.page';
import { TranslateModule } from '@ngx-translate/core';
import { MatModule } from 'src/app/modules/mat.module';

import { CustomModule } from 'src/app/modules/custom.module';
import { ComponentsModule } from 'src/app/modules/components.module';
import { PipesModule } from 'src/app/modules/pipes.module';
import { DirectivesModule } from 'src/app/modules/directives.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MatModule,
    TranslateModule,
    ComponentsModule,
    DirectivesModule,
    PipesModule,
    DetailsPageRoutingModule
  ],
  declarations: [DetailsPage]
})
export class DetailsPageModule { }
