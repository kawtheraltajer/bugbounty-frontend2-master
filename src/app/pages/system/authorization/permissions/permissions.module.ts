import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PermissionsPageRoutingModule } from './permissions-routing.module';

import { PermissionsPage } from './permissions.page';
import { ComponentsModule } from 'src/app/modules/components.module';
import { MatModule } from 'src/app/modules/mat.module';
import { PipesModule } from 'src/app/modules/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PermissionsPageRoutingModule,
    ComponentsModule,
    MatModule,
    PipesModule
  ],
  declarations: [PermissionsPage]
})
export class PermissionsPageModule { }
