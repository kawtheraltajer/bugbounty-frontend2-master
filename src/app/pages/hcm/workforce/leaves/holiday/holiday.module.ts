import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HolidayPageRoutingModule } from './holiday-routing.module';
import { HolidayPage } from './holiday.page';
import { MatModule } from 'src/app/modules/mat.module';
import { ComponentsModule } from 'src/app/modules/components.module';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from 'src/app/modules/pipes.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HolidayPageRoutingModule,
    MatModule,
    ComponentsModule,
    TranslateModule, 
    PipesModule
  ],
  declarations: [HolidayPage]
})
export class HolidayPageModule {}
