import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TasksPageRoutingModule } from './tasks-routing.module';

import { TasksPage } from './tasks.page';
import { MatModule } from 'src/app/modules/mat.module';
import { ComponentsModule } from 'src/app/modules/components.module';
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
    ComponentsModule,
    TasksPageRoutingModule,
  ],
  declarations: [TasksPage]
})
export class TasksPageModule { }
