import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CustInvoicePageRoutingModule } from './cust-invoice-routing.module';

import { CustInvoicePage } from './cust-invoice.page';
import { ComponentsModule } from 'src/app/modules/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    CustInvoicePageRoutingModule
  ],
  declarations: [CustInvoicePage]
})
export class CustInvoicePageModule {}
