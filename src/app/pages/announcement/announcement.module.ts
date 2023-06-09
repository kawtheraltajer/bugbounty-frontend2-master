import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AnnouncementPageRoutingModule } from './announcement-routing.module';
import { ComponentsModule } from 'src/app/modules/components.module';

import { AnnouncementPage } from './announcement.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AnnouncementPageRoutingModule,
    ComponentsModule
  ],
  declarations: [AnnouncementPage]
})
export class AnnouncementPageModule {}
