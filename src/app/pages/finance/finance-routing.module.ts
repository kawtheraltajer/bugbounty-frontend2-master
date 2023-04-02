import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FinancePage } from './finance.page';
import { TaxCodeDetailsModal } from '../../components/lists/tax-code-list/tax-code-list.component';
import { ItemDetailsModal } from 'src/app/components/lists/item-list/item-list.component';
import { AccountTypeDetailsModal } from 'src/app/components/lists/account-type-list/account-type-list.component';
import { AccountCodeDetailsModal } from 'src/app/components/lists/account-code-list/account-code-list.component';
import { AddExpenseModal, ExpenseDetailModal, UpdateExpenseModal } from 'src/app/components/lists/expense-list/expense-list.component';
import { AddReceiptModal, ReceiptDetailModal } from 'src/app/components/lists/receipt-list/receipt-list.component';
import { AddInvoiceModal, InvoiceDetailModal, UpdateInvoiceModal } from 'src/app/components/lists/invoice-list/invoice-list.component';
import { AccountTransectionDetailModal, AddAccountTransectionModal } from 'src/app/components/lists/account-transection-list/account-transection-list.component';
import { SupplierDetailModal } from 'src/app/components/lists/supplier-list/supplier-list.component';
import { PLBSCategoryDetailModal } from '../../components/lists/plbs-category-list/plbs-category-list.component';
import { PLBSSubCategoryDetailModal } from 'src/app/components/lists/plbs-sub-category-list/plbs-sub-category-list.component';
import { CustInvoiceDetailModal } from 'src/app/components/lists/cust-invoice-list/cust-invoice-list.component';


const routes: Routes = [
  {
    path: '',
    component: FinancePage,
    children: [
      {
        path: 'tax',
        loadChildren: () => import('./tax/tax.module').then(m => m.TaxPageModule)
      },
      {
        path: 'taxCodeDetail/:id',
        component: TaxCodeDetailsModal, data: { noMenu: true }
      },
      {
        path: 'items',
        loadChildren: () => import('./items/items.module').then(m => m.ItemsPageModule)
      },
      {
        path: 'itemDetail/:id',
        component: ItemDetailsModal, data: { noMenu: true }
      },
      {
        path: 'invoice',
        loadChildren: () => import('./invoice/invoice.module').then(m => m.InvoicePageModule)
      },
      {
        path: 'add-invoice',
        component: AddInvoiceModal, data: { noMenu: true }
      },
      {
        path: 'invoice-detail/:id',
        component: InvoiceDetailModal, data: { noMenu: true }
      },
      {
        path: 'update-invoice/:id',
        component: UpdateInvoiceModal, data: { noMenu: true }
      },
      {
        path: 'expense',
        loadChildren: () => import('./expense/expense.module').then(m => m.ExpensePageModule)
      },
      {
        path: 'expense-detail/:id',
        component: ExpenseDetailModal, data: { noMenu: true }
      },
      {
        path: 'update-expense/:id',
        component: UpdateExpenseModal, data: { noMenu: true }
      },
      {
        path: 'add-expense',
        component: AddExpenseModal, data: { noMenu: true }
      },
      {
        path: 'account-type',
        loadChildren: () => import('./account-type/account-type.module').then(m => m.AccountTypePageModule)
      },
      {
        path: 'account-type-detail/:id',
        component: AccountTypeDetailsModal, data: { noMenu: true }
      },
      {
        path: 'account-code',
        loadChildren: () => import('./account-code/account-code.module').then(m => m.AccountCodePageModule)
      },
      {
        path: 'account-code-detail/:id',
        component: AccountCodeDetailsModal, data: { noMenu: true }
      },
      {
        path: 'receipt',
        loadChildren: () => import('./receipt/receipt.module').then(m => m.ReceiptPageModule)
      },
      {
        path: 'add-receipt',
        component: AddReceiptModal, data: { noMenu: true }
      },
      {
        path: 'receipt-detail/:id',
        component: ReceiptDetailModal, data: { noMenu: true }
      },
      {
        path: 'account-transection',
        loadChildren: () => import('./account-transection/account-transection.module').then(m => m.AccountTransectionPageModule)
      },
      {
        path: 'add-transection',
        component: AddAccountTransectionModal, data: { noMenu: true }
      },
      {
        path: 'transection-detail/:id',
        component: AccountTransectionDetailModal, data: { noMenu: true }
      },
      {
        path: 'reports',
        loadChildren: () => import('./reports/reports.module').then(m => m.ReportsPageModule)
      },
      {
        path: 'supplier',
        loadChildren: () => import('./supplier/supplier.module').then(m => m.SupplierPageModule)
      },
      {
        path: 'supplier/:id',
        component: SupplierDetailModal, data: { noMenu: true }
      },
      {
        path: 'plbs-category',
        loadChildren: () => import('./plbs-category/plbs-category.module').then(m => m.PLBSCategoryPageModule)
      },
      {
        path: 'plbs-category/:id',
        component: PLBSCategoryDetailModal, data: { noMenu: true }
      },
      {
        path: 'plbs-sub-category',
        loadChildren: () => import('./plbs-sub-category/plbs-sub-category.module').then(m => m.PLBSSubCategoryPageModule)
      },
      {
        path: 'plbs-sub-category/:id',
        component: PLBSSubCategoryDetailModal, data: { noMenu: true }
      },
      {
        path: 'cust-invoice',
        loadChildren: () => import('./cust-invoice/cust-invoice.module').then(m => m.CustInvoicePageModule)
      },
      {
        path: 'cust-invoice-detail/:id',
        component: CustInvoiceDetailModal, data: { noMenu: true }
      },
      {
        path: 'normal-reports',
        loadChildren: () => import('./normal-reports/normal-reports.module').then(m => m.NormalReportsPageModule)
      }, {
        //ChargesPageModule
        path: 'charges',
        loadChildren: () => import('./charges/charges.module').then(m => m.ChargesPageModule)
      }
    ]
  },




];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FinancePageRoutingModule { }
