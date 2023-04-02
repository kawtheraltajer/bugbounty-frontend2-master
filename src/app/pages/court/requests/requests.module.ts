import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RequestsPageRoutingModule } from './requests-routing.module';

import { RequestsPage } from './requests.page';
import { TranslateModule } from '@ngx-translate/core';
import { MatModule } from 'src/app/modules/mat.module';
import { ComponentsModule } from 'src/app/modules/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RequestsPageRoutingModule,
    TranslateModule,
    MatModule,
    ComponentsModule
  ],
  declarations: [RequestsPage]
})
export class RequestsPageModule {}
