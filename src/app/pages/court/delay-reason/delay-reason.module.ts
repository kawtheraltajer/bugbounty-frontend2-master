import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DelayReasonPageRoutingModule } from './delay-reason-routing.module';
import { DelayReasonPage } from './delay-reason.page';
import { TranslateModule } from '@ngx-translate/core';
import { MatModule } from 'src/app/modules/mat.module';
import { ComponentsModule } from 'src/app/modules/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DelayReasonPageRoutingModule,
    TranslateModule,
    MatModule,
    ComponentsModule
  ],
  declarations: [DelayReasonPage]
})
export class DelayReasonPageModule {}
