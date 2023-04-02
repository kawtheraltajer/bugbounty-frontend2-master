import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatModule } from 'src/app/modules/mat.module';
import { IonicModule } from '@ionic/angular';
import { CaseTypesPageRoutingModule } from './case-types-routing.module';
import { CaseTypesPage } from './case-types.page';
import { ComponentsModule } from 'src/app/modules/components.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CaseTypesPageRoutingModule,
    TranslateModule,
    MatModule,
    ComponentsModule
  ],
  declarations: [CaseTypesPage]
})
export class CaseTypesPageModule {}
