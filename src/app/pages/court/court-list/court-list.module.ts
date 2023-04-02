import { MatModule } from 'src/app/modules/mat.module';
import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CourtListPageRoutingModule } from './court-list-routing.module';

import { CourtListPage } from './court-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CourtListPageRoutingModule,
    TranslateModule,
    MatModule,
  ],
  declarations: [CourtListPage]
})
export class CourtListPageModule {}



