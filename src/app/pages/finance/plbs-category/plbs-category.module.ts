import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PLBSCategoryPageRoutingModule } from './plbs-category-routing.module';

import { PLBSCategoryPage } from './plbs-category.page';
import { ComponentsModule } from 'src/app/modules/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    PLBSCategoryPageRoutingModule
  ],
  declarations: [PLBSCategoryPage]
})
export class PLBSCategoryPageModule {}
