import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GroupsPageRoutingModule } from './groups-routing.module';

import { GroupsPage } from './groups.page';
import { ComponentsModule } from 'src/app/modules/components.module';
import { MatModule } from 'src/app/modules/mat.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    MatModule,
    TranslateModule,
    GroupsPageRoutingModule
  ],
  declarations: [GroupsPage]
})
export class GroupsPageModule { }
