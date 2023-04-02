import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClientsPageRoutingModule } from './clients-routing.module';

import { ClientsPage } from './clients.page';

import { TranslateModule } from '@ngx-translate/core';
import { MatModule } from 'src/app/modules/mat.module';
import { ComponentsModule } from 'src/app/modules/components.module'
import { PipesModule } from 'src/app/modules/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClientsPageRoutingModule,
    TranslateModule,
    MatModule,
    ComponentsModule,
    PipesModule
  ],
  declarations: [ClientsPage]
})
export class ClientsPageModule {}
