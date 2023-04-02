import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BookingPageRoutingModule } from './booking-routing.module';

import { BookingPage } from './booking.page';
import { ComponentsModule } from 'src/app/modules/components.module';
import { MatModule } from 'src/app/modules/mat.module';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from 'src/app/modules/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    PipesModule,
    MatModule,
    ComponentsModule,
    BookingPageRoutingModule
  ],
  declarations: [BookingPage]
})
export class BookingPageModule { }
