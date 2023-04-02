import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PLBSSubCategoryPageRoutingModule } from './plbs-sub-category-routing.module';

import { PLBSSubCategoryPage } from './plbs-sub-category.page';
import { ComponentsModule } from 'src/app/modules/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    PLBSSubCategoryPageRoutingModule
  ],
  declarations: [PLBSSubCategoryPage]
})
export class PLBSSubCategoryPageModule {}
