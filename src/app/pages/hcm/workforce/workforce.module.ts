import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { WorkforcePageRoutingModule } from './workforce-routing.module';
import { MatModule } from 'src/app/modules/mat.module';
import { WorkforcePage } from './workforce.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MatModule,
    WorkforcePageRoutingModule,
    TranslateModule
  
  ],
  declarations: [WorkforcePage]
})
export class WorkforcePageModule {}


