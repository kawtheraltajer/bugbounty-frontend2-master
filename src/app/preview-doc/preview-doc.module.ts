import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PreviewDocPageRoutingModule } from './preview-doc-routing.module';

import { PreviewDocPage } from './preview-doc.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PreviewDocPageRoutingModule
  ],
  declarations: [PreviewDocPage]
})
export class PreviewDocPageModule {}
