import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TemplatePageRoutingModule } from './template-routing.module';

import { TemplatePage } from './template.page';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from 'src/app/modules/components.module';
import { DirectivesModule } from 'src/app/modules/directives.module';
import { MatModule } from 'src/app/modules/mat.module';
import { PipesModule } from 'src/app/modules/pipes.module';

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
    TemplatePageRoutingModule
  ],
  declarations: [TemplatePage]
})
export class TemplatePageModule { }
