import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CourtPageRoutingModule } from './court-routing.module';
import { CourtPage } from './court.page';
import { MatModule } from 'src/app/modules/mat.module';
import { ComponentsModule } from 'src/app/modules/components.module';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from 'src/app/modules/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CourtPageRoutingModule,
    MatModule,
    ComponentsModule,
    TranslateModule,
    PipesModule
  ],
  declarations: [CourtPage]
})
export class CourtPageModule {}
