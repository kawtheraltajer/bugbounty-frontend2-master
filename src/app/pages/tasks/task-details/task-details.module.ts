import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TaskDetailsPageRoutingModule } from './task-details-routing.module';

import { TaskDetailsPage } from './task-details.page';
import { TranslateModule } from '@ngx-translate/core';
import { MatModule } from 'src/app/modules/mat.module';
import { ComponentsModule } from 'src/app/modules/components.module';
import { EditorModule } from '@tinymce/tinymce-angular';
import { PipesModule } from 'src/app/modules/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    MatModule,
    EditorModule,
    PipesModule,
    ComponentsModule,
    TaskDetailsPageRoutingModule
  ],
  declarations: [TaskDetailsPage]
})
export class TaskDetailsPageModule { }
