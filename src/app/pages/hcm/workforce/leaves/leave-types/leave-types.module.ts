import { MatModule } from 'src/app/modules/mat.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ComponentsModule } from 'src/app/modules/components.module';

import { IonicModule } from '@ionic/angular';

import { LeaveTypesPageRoutingModule } from './leave-types-routing.module';

import { LeaveTypesPage } from './leave-types.page';

import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from 'src/app/modules/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LeaveTypesPageRoutingModule,
    MatModule,
    ComponentsModule,
    TranslateModule,
    PipesModule
    
  ],
  declarations: [LeaveTypesPage]
})
export class LeaveTypesPageModule {}
