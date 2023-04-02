import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment";
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, concat } from 'rxjs';
import { AccountType, Item, TaxCode, AccountCode, Receipt, Invoice, Expense, ExpenseDetail, InvoiceDetail, ReceiptDetail, AccTransectionHeader, AccTransectionDetail, Supplier, PLBSCategory, PLBSSubCategory, PLBSSubCatAccCodeMapping } from '../interfaces/types';
import { AnyNode } from 'postcss';

@Injectable({
  providedIn: 'root'
})
export class FinanceService {
  TaxCodes: BehaviorSubject<TaxCode[]> = new BehaviorSubject<TaxCode[]>([]);
  Items: BehaviorSubject<Item[]> = new BehaviorSubject<Item[]>([]);
  AccountTypes: BehaviorSubject<AccountType[]> = new BehaviorSubject<AccountType[]>([]);
  AccountCodes: BehaviorSubject<AccountCode[]> = new BehaviorSubject<AccountCode[]>([]);
  Expenses: BehaviorSubject<Expense[]> = new BehaviorSubject<Expense[]>([]);
  ExpenseDetails: BehaviorSubject<ExpenseDetail[]> = new BehaviorSubject<ExpenseDetail[]>([]);
  Invoices: BehaviorSubject<Invoice[]> = new BehaviorSubject<Invoice[]>([]);
  InvoiceDetails: BehaviorSubject<InvoiceDetail[]> = new BehaviorSubject<InvoiceDetail[]>([]);
  Receipts: BehaviorSubject<Receipt[]> = new BehaviorSubject<Receipt[]>([]);
  ReceiptDetails: BehaviorSubject<ReceiptDetail[]> = new BehaviorSubject<ReceiptDetail[]>([]);
  AccTransectionHeaders: BehaviorSubject<AccTransectionHeader[]> = new BehaviorSubject<AccTransectionHeader[]>([]);
  AccTransectionDetails: BehaviorSubject<AccTransectionDetail[]> = new BehaviorSubject<AccTransectionDetail[]>([]);
  Suppliers: BehaviorSubject<Supplier[]> = new BehaviorSubject<Supplier[]>([]);
  PLBSCategories: BehaviorSubject<PLBSCategory[]> = new BehaviorSubject<PLBSCategory[]>([]);
  PLBSSubCategories: BehaviorSubject<PLBSSubCategory[]> = new BehaviorSubject<PLBSSubCategory[]>([]);
  constructor(public http: HttpClient) { }


  ///////-------------------------------------------------------------------------------------Finance

  ///TaxCode
  async generateReport(data: any) {
    let res = await this.http.post<[]>(`${environment.apiUrl}/invoice/generateReport/`, { data }, { withCredentials: true }).toPromise();
    return res;
  }
  


  async getExpenceItems() {
    let res = await this.http.get<[]>(`${environment.apiUrl}/invoice/getExpenceItems/getAll/`).toPromise();
    return res;

  }

  async getIncomeItems() {
    let res = await this.http.get<[]>(`${environment.apiUrl}/invoice/getIncomeItems/getAll/`).toPromise();
    return res;

  }
  
  async getReport(Filter: any) {
    let res = await this.http.post<any>(`${environment.apiUrl}/invoice/getReport/`, { Filter }, { withCredentials: true }).toPromise();
    return res;
  }

  async getAllTaxCode() {
    let res = await this.http.get<TaxCode[]>(`${environment.apiUrl}/invoice/taxcode/all/`).toPromise();
    this.TaxCodes.next(res);
    return res;

  }

  async getTaxCode(id: number) {
    return await this.http.get<TaxCode>(`${environment.apiUrl}/invoice/taxcode/get/${id}`).toPromise();
  }
  async AddTaxCode(data: TaxCode) {
    let res = await this.http.post<TaxCode>(`${environment.apiUrl}/invoice/taxcode/create/`, data, { withCredentials: true }).toPromise();
    await this.getAllTaxCode();

    return res;
  }

  async linkcasetoinvoice(data: any) {
    let res = await this.http.post<any>(`${environment.apiUrl}/invoice/linkcasetoinvoice/`, data, { withCredentials: true }).toPromise();

    return res;
  }
  async UpdateTaxCode(input: TaxCode) {
    let { id, ...data } = input
    let res = await this.http.post<TaxCode>(`${environment.apiUrl}/invoice/taxcode/update/`, { id, data }, { withCredentials: true }).toPromise();
    await this.getAllTaxCode();

    return res;
  }

  async deleteTaxCode(id: number) {
    let res = await this.http.post<TaxCode>(`${environment.apiUrl}/invoice/taxcode/delete/`, { id }, { withCredentials: true }).toPromise();
    await this.getAllTaxCode();

    return res;
  }
  ///TaxCode

  ///Items

  async getAllItems() {
    let res = await this.http.get<Item[]>(`${environment.apiUrl}/invoice/item/getAll/`).toPromise();
    this.Items.next(res);
    return res;

  }

  async getItem(id: number) {
    return await this.http.get<Item>(`${environment.apiUrl}/invoice/item/get/${id}`).toPromise();
  }

  async getItemForDropdown(value: string) {
    return await this.http.get<Item[]>(`${environment.apiUrl}/invoice/item/getDropdown/${value}`).toPromise();
  }

  async AddItem(data: Item) {
    let res = await this.http.post<Item>(`${environment.apiUrl}/invoice/item/create/`, data, { withCredentials: true }).toPromise();
    await this.getAllItems();
    return res;
  }

  async UpdateItem(input: Item) {
    let { id, ...data } = input
    let res = await this.http.post<Item>(`${environment.apiUrl}/invoice/item/update/`, { id, data }, { withCredentials: true }).toPromise();
    await this.getAllItems();

    return res;
  }

  async deleteItem(id: number) {
    let res = await this.http.post<Item>(`${environment.apiUrl}/invoice/item/delete/`, { id }, { withCredentials: true }).toPromise();
    await this.getAllItems();

    return res;
  }
  ///Items

  ///Account Type

  async getAllAccountTypes() {
    let res = await this.http.get<AccountType[]>(`${environment.apiUrl}/invoice/accountType/getAll`).toPromise();
    this.AccountTypes.next(res);
    return res;

  }

  async getAccountType(id: number) {
    return await this.http.get<AccountType>(`${environment.apiUrl}/invoice/accountType/get/${id}`).toPromise();
  }

  async AddAccountType(data: AccountType) {
    let res = await this.http.post<AccountType>(`${environment.apiUrl}/invoice/accountType/create/`, data, { withCredentials: true }).toPromise();
    await this.getAllAccountTypes();

    return res;
  }

  async UpdateAccountType(input: AccountType) {
    let { id, ...data } = input
    let res = await this.http.post<AccountType>(`${environment.apiUrl}/invoice/accountType/update/`, { id, data }, { withCredentials: true }).toPromise();
    await this.getAllAccountTypes();

    return res;
  }

  async deleteAccountType(id: number) {
    let res = await this.http.post<AccountType>(`${environment.apiUrl}/invoice/accountType/delete/`, { id }, { withCredentials: true }).toPromise();
    await this.getAllAccountTypes();

    return res;
  }
  ///Account Type

  ///Account Code

  async getAllAccountCodes() {
    let res = await this.http.get<AccountCode[]>(`${environment.apiUrl}/invoice/accountCode/getAll/`).toPromise();
    this.AccountCodes.next(res);
    return res;
  }

  async getAccountCodesForAccountType(id: number) {
    let res = await this.http.get<AccountCode[]>(`${environment.apiUrl}/invoice/accountCode/getForAccountType/${id}`).toPromise();
    this.AccountCodes.next(res);
    return res;

  }

  async getAccountCode(id: number) {
    return await this.http.get<AccountCode>(`${environment.apiUrl}/invoice/accountCode/get/${id}`).toPromise();
  }

  async AddAccountCode(data: AccountCode) {
    let res = await this.http.post<AccountCode>(`${environment.apiUrl}/invoice/accountCode/create/`, data, { withCredentials: true }).toPromise();
    await this.getAllAccountCodes();

    return res;
  }

  async UpdateAccountCode(input: AccountCode) {
    let { id, ...data } = input
    let res = await this.http.post<AccountCode>(`${environment.apiUrl}/invoice/accountCode/update/`, { id, data }, { withCredentials: true }).toPromise();
    await this.getAllAccountCodes();

    return res;
  }

  async deleteAccountCode(id: number) {
    let res = await this.http.post<AccountCode>(`${environment.apiUrl}/invoice/accountCode/delete/`, { id }, { withCredentials: true }).toPromise();
    await this.getAllAccountCodes();

    return res;
  }
  ///Account Code

  /// Expense

  async getAllExpenses() {
    let res = await this.http.get<Expense[]>(`${environment.apiUrl}/invoice/expense/getAll/`).toPromise();
    this.Expenses.next(res);
    return res;

  }

  async getAllExpensesWithRange(range: {start: Date, end: Date}, getAll: boolean) {
    return await this.http.post<Expense[]>(`${environment.apiUrl}/invoice/getAllExpensesWithRange/`, { range, getAll }).toPromise();
  }

  async getExpenceTotalForNormalReports(filter: any) {
    return await this.http.post<any>(`${environment.apiUrl}/invoice/getExpenceTotalForNormalReports/`, { filter: filter}).toPromise();
  }

  async getExpense(id: number) {
    return await this.http.get<Expense>(`${environment.apiUrl}/invoice/expense/get/${id}`).toPromise();
  }

  async AddExpense(data: Expense) {
    let res = await this.http.post<Expense>(`${environment.apiUrl}/invoice/expense/create/`, data, { withCredentials: true }).toPromise();
    await this.getAllExpenses();

    return res;
  }

  async UpdateExpense( id:number, data: any) {
    //let { id, ...data } = input
    let res = await this.http.post<Expense>(`${environment.apiUrl}/invoice/expense/update/`, { id, data }, { withCredentials: true }).toPromise();
    await this.getAllExpenses();

    return res;
  }

  async deleteExpense(id: number) {
    let res = await this.http.post<Expense>(`${environment.apiUrl}/invoice/expense/delete/`, { id }, { withCredentials: true }).toPromise();
    await this.getAllExpenses();

    return res;
  }
  /// Expense

  /// Expense Detail

  async getAllExpenseDetails(id: number) {
    let res = await this.http.get<ExpenseDetail[]>(`${environment.apiUrl}/invoice/expenseDetail/getAll/${id}`).toPromise();
    this.ExpenseDetails.next(res);
    return res;
  }

  async getExpenseDetail(id: number) {
    return await this.http.get<ExpenseDetail>(`${environment.apiUrl}/invoice/expenseDetail/get/${id}`).toPromise();
  }

  async AddExpenseDetail(data: ExpenseDetail) {
    let res = await this.http.post<ExpenseDetail>(`${environment.apiUrl}/invoice/expenseDetail/create/`, data, { withCredentials: true }).toPromise();
    await this.getAllExpenses();
    return res;
  }

  async UpdateExpenseDetail(input: ExpenseDetail) {
    let { id, ...data } = input
    let res = await this.http.post<ExpenseDetail>(`${environment.apiUrl}/invoice/expenseDetail/update/`, { id, data }, { withCredentials: true }).toPromise();
    await this.getAllExpenses();

    return res;
  }

  async deleteExpenseDetail(id: number) {
    let res = await this.http.post<ExpenseDetail>(`${environment.apiUrl}/invoice/expenseDetail/delete/`, { id }, { withCredentials: true }).toPromise();
    await this.getAllExpenses();

    return res;
  }
  /// Expense Detail

  /// Invoice

  async getAllInvoices() {
    let res = await this.http.get<Invoice[]>(`${environment.apiUrl}/invoice/invoice/getAll/`).toPromise();
    this.Invoices.next(res);
    return res;
  }
  async getunlinkInvoices() {
    let res = await this.http.get<Invoice[]>(`${environment.apiUrl}/invoice/invoice/getunlinkInvoices/`).toPromise();
    this.Invoices.next(res);
    return res;
  }

  async getAllInvoicesWithRange(range: {start: Date, end: Date}, getAll: boolean) {
    return await this.http.post<Invoice[]>(`${environment.apiUrl}/invoice/getAllInvoicesWithRange/`, { range, getAll }).toPromise();
  }
  

  async getInvoice(id: number) {
    return await this.http.get<Invoice>(`${environment.apiUrl}/invoice/invoice/get/${id}`).toPromise();
  }

  async getInvoiceForCustomer(id: number) {
    let res = await this.http.get<Invoice[]>(`${environment.apiUrl}/invoice/invoice/getForCustomer/${id}`).toPromise();
    this.Invoices.next(res);
    return res;
  }

  async getDueInvoice() {
    let res = await this.http.get<Invoice[]>(`${environment.apiUrl}/invoice/invoice/getDueInvoice`).toPromise();
    this.Invoices.next(res);
    return res;
  }
  

  async AddInvoice(data: any) {

   let res = await this.http.post<Invoice>(`${environment.apiUrl}/invoice/invoice/create/`, {data}, { withCredentials: true }).toPromise();
  await this.getAllInvoices();

  return res;
  }

  async UpdateInvoice(input: any) {
    let { id, ...data } = input
    let res = await this.http.post<Invoice>(`${environment.apiUrl}/invoice/invoice/update/`, { id, data }, { withCredentials: true }).toPromise();
    await this.getAllInvoices();

    return res;
  }

  async deleteInvoice(id: number) {
    let res = await this.http.post<Invoice>(`${environment.apiUrl}/invoice/invoice/delete/`, { id }, { withCredentials: true }).toPromise();
    await this.getAllInvoices();

    return res;
  }

  async deleteReceipt(id: number) {
    let res = await this.http.post<Receipt>(`${environment.apiUrl}/invoice/receipt/delete/`, { id }, { withCredentials: true }).toPromise();
    await this.getAllReceipts();

    return res;
  }

  async getInvoiceTotal(range: {start: Date, end: Date}) {
    return await this.http.post<any>(`${environment.apiUrl}/invoice/getInvoiceTotal/`, { range }).toPromise();
  }

  async getDueInvoiceTotal() {
    return await this.http.post<any>(`${environment.apiUrl}/invoice/getDueInvoiceTotal`,{}).toPromise();
  }

  

  async getInvoiceTotalForNormalReports(filter: any) {
    return await this.http.post<any>(`${environment.apiUrl}/invoice/getInvoiceTotalForNormalReports/`, { filter: filter}).toPromise();
  }
  /// Invoice

  /// Invoice Detail

  async getAllInvoiceDetails(id: number) {
    let res = await this.http.get<InvoiceDetail[]>(`${environment.apiUrl}/invoice/invoiceDetail/getAll/${id}`).toPromise();
    this.InvoiceDetails.next(res);
    return res;
  }

  async getInvoiceDetail(id: number) {
    return await this.http.get<InvoiceDetail>(`${environment.apiUrl}/invoice/invoiceDetail/get/${id}`).toPromise();
  }

  async AddInvoiceDetail(data: InvoiceDetail) {
    let res = await this.http.post<InvoiceDetail>(`${environment.apiUrl}/invoice/invoiceDetail/create/`, data, { withCredentials: true }).toPromise();
    await this.getAllInvoices();
    return res;
  }

  async UpdateInvoiceDetail(input: InvoiceDetail) {
    let { id, ...data } = input
    let res = await this.http.post<InvoiceDetail>(`${environment.apiUrl}/invoice/invoiceDetail/update/`, { id, data }, { withCredentials: true }).toPromise();
    await this.getAllInvoices();

    return res;
  }

  async deleteInvoiceDetail(id: number) {

    return await this.http.get<InvoiceDetail>(`${environment.apiUrl}/invoice/DeleteinvoiceDetail/${id}`).toPromise();

  }
  /// Invoice Detail

  /// Receipt

  async getAllReceipts() {
    let res = await this.http.get<Receipt[]>(`${environment.apiUrl}/invoice/receipt/getAll/`).toPromise();
    this.Receipts.next(res);
    return res;

  }

  async getAllReceiptsWithRange(range: {start: Date, end: Date}, getAll: boolean) {
    return await this.http.post<Receipt[]>(`${environment.apiUrl}/invoice/getAllReceiptsWithRange/`, { range, getAll }).toPromise();
  }
  async getAllReceiptsWithRangeCount(range: {start: Date, end: Date}, getAll: boolean) {
    return await this.http.post<Number>(`${environment.apiUrl}/invoice/getAllReceiptsWithRangeCount/`, { range, getAll }).toPromise();
  }
  async getDuePaymentCount(range: {start: Date, end: Date}, getAll: boolean) {
    return await this.http.post<Number>(`${environment.apiUrl}/invoice/getDuePaymentCount/`, { range, getAll }).toPromise();
  }

  async getAllIDueInvoiceWithRange(range: {start: Date, end: Date}, getAll: boolean) {
    return await this.http.post<Invoice[]>(`${environment.apiUrl}/invoice/getAllIDueInvoiceWithRange/`, { range, getAll }).toPromise();
  }
  
  
  async getReceiptTotalForNormalReports(filter: any) {
    return await this.http.post<any>(`${environment.apiUrl}/invoice/getReceiptTotalForNormalReports/`, { filter: filter}).toPromise();
  }

  async getReceipt(id: number) {
    return await this.http.get<Receipt>(`${environment.apiUrl}/invoice/receipt/get/${id}`).toPromise();
  }

  async AddReceipt(data: Receipt) {
    let res = await this.http.post<Receipt>(`${environment.apiUrl}/invoice/receipt/create/`, data, { withCredentials: true }).toPromise();
    await this.getAllReceipts();

    return res;
  }

  async UpdateReceipt(input: Receipt) {
    let { id, ...data } = input
    let res = await this.http.post<Receipt>(`${environment.apiUrl}/invoice/receipt/update/`, { id, data }, { withCredentials: true }).toPromise();
    await this.getAllReceipts();

    return res;
  }

  /// Receipt

  /// Receipt Detail

  async getAllReceiptDetails(id: number) {
    let res = await this.http.get<ReceiptDetail[]>(`${environment.apiUrl}/invoice/receiptDetail/getAll/${id}`).toPromise();
    this.ReceiptDetails.next(res);
    return res;
  }

  async getReceiptDetail(id: number) {
    return await this.http.get<ReceiptDetail>(`${environment.apiUrl}/invoice/receiptDetail/get/${id}`).toPromise();
  }

  async AddReceiptDetail(data: ReceiptDetail) {
    let res = await this.http.post<ReceiptDetail>(`${environment.apiUrl}/invoice/receiptDetail/create/`, data, { withCredentials: true }).toPromise();
    await this.getAllReceipts();
    return res;
  }

  async UpdateReceiptDetail(input: ReceiptDetail) {
    let { id, ...data } = input
    let res = await this.http.post<ReceiptDetail>(`${environment.apiUrl}/invoice/receiptDetail/update/`, { id, data }, { withCredentials: true }).toPromise();
    await this.getAllReceipts();

    return res;
  }

  async deleteReceiptDetail(id: number) {
    let res = await this.http.post<ReceiptDetail>(`${environment.apiUrl}/invoice/receiptDetail/delete/`, { id }, { withCredentials: true }).toPromise();
    await this.getAllReceipts();

    return res;
  }
  /// Receipt Detail

  /// AccTransectionHeaders

  async getAllAccountTransections() {
    let res = await this.http.get<AccTransectionHeader[]>(`${environment.apiUrl}/invoice/accTransectionHeader/getAll/`).toPromise();
    this.AccTransectionHeaders.next(res);
    return res;

  }

  async getAccountTransection(id: number) {
    return await this.http.get<AccTransectionHeader>(`${environment.apiUrl}/invoice/accTransectionHeader/get/${id}`).toPromise();
  }

  async AddAccountTransection(data: AccTransectionHeader) {
    let res = await this.http.post<AccTransectionHeader>(`${environment.apiUrl}/invoice/accTransectionHeader/create/`, data, { withCredentials: true }).toPromise();
    await this.getAllAccountTransections();

    return res;
  }

  async getAccountTransectionRport(fromDate: Date, toDate: Date) {
    return await this.http.post<AccTransectionHeader[]>(`${environment.apiUrl}/invoice/report/accTransectionReport/`, {
      fromDate,
      toDate
    }).toPromise();
  }

  async UpdateAccountTransections(input: AccTransectionHeader) {
    let { id, ...data } = input
    let res = await this.http.post<AccTransectionHeader>(`${environment.apiUrl}/invoice/accTransectionHeader/update/`, { id, data }, { withCredentials: true }).toPromise();
    await this.getAllAccountTransections();

    return res;
  }

  async deleteAccountTransections(id: number) {
    let res = await this.http.post<AccTransectionHeader>(`${environment.apiUrl}/invoice/accTransectionHeader/delete/`, { id }, { withCredentials: true }).toPromise();
    await this.getAllAccountTransections();

    return res;
  }
  /// AccTransectionHeaders

  /// AccTransectionDetails

  async getAllAccountTransectionDetails(id: number) {
    let res = await this.http.get<AccTransectionDetail[]>(`${environment.apiUrl}/invoice/accTransectionDetail/getAll/${id}`).toPromise();
    this.AccTransectionDetails.next(res);
    return res;
  }

  async getAccountTransectionDetail(id: number) {
    return await this.http.get<AccTransectionDetail>(`${environment.apiUrl}/invoice/accTransectionDetail/get/${id}`).toPromise();
  }

  async AddAccountTransectionDetail(data: AccTransectionDetail) {
    let res = await this.http.post<AccTransectionDetail>(`${environment.apiUrl}/invoice/accTransectionDetail/create/`, data, { withCredentials: true }).toPromise();
    await this.getAllAccountTransections();
    return res;
  }

  async UpdateAccountTransectionDetail(input: AccTransectionDetail) {
    let { id, ...data } = input
    let res = await this.http.post<AccTransectionDetail>(`${environment.apiUrl}/invoice/accTransectionDetail/update/`, { id, data }, { withCredentials: true }).toPromise();
    await this.getAllAccountTransections();

    return res;
  }

  async deleteAccountTransectionDetail(id: number) {
    let res = await this.http.post<AccTransectionDetail>(`${environment.apiUrl}/invoice/accTransectionDetail/delete/`, { id }, { withCredentials: true }).toPromise();
    await this.getAllAccountTransections();
    return res;
  }
  /// AccTransectionDetails

  //----------reports
  async getIncomeRport(fromDate: Date, toDate: Date) {
    return await this.http.post<Invoice[]>(`${environment.apiUrl}/invoice/report/incomeReport/`, {
      fromDate,
      toDate
    }).toPromise();
  }

  async getExpenseRport(fromDate: Date, toDate: Date) {
    return await this.http.post<Expense[]>(`${environment.apiUrl}/invoice/report/expenseReport/`, {
      fromDate,
      toDate
    }).toPromise();
  }

  async getIncomeVat(fromDate: Date, toDate: Date) {
    return await this.http.post<Invoice[]>(`${environment.apiUrl}/invoice/report/incomeVat/`, {
      fromDate,
      toDate
    }).toPromise();
  }

  async getExpenseVat(fromDate: Date, toDate: Date) {
    return await this.http.post<Expense[]>(`${environment.apiUrl}/invoice/report/expenseVat/`, {
      fromDate,
      toDate
    }).toPromise();
  }

  //----------reports

  //---supplier

  async getAllSuppliers() {
    let res = await this.http.get<Supplier[]>(`${environment.apiUrl}/invoice/supplier/getAll/`).toPromise();
    this.Suppliers.next(res);
    return res;

  }

  async getSupplier(id: number) {
    return await this.http.get<Supplier>(`${environment.apiUrl}/invoice/supplier/get/${id}`).toPromise();
  }



  async AddSupplier(data: Supplier) {
    let res = await this.http.post<Supplier>(`${environment.apiUrl}/invoice/supplier/create/`, data, { withCredentials: true }).toPromise();
    await this.getAllSuppliers();

    return res;
  }

  async UpdateSupplier(input: Supplier) {
    let { id, ...data } = input
    let res = await this.http.post<Supplier>(`${environment.apiUrl}/invoice/supplier/update/`, { id, data }, { withCredentials: true }).toPromise();
    await this.getAllSuppliers();

    return res;
  }

  async DeleteSupplier(id: number) {
    let res = await this.http.post<Supplier>(`${environment.apiUrl}/invoice/supplier/delete/`, { id }, { withCredentials: true }).toPromise();
    await this.getAllSuppliers();

    return res;
  }

  //---supplier


  //---PLBSCategory

  async getAllPLBSCategories() {
    let res = await this.http.get<PLBSCategory[]>(`${environment.apiUrl}/invoice/plbsCategory/getAll/`).toPromise();
    this.PLBSCategories.next(res);
    return res;

  }

  async getPLBSCategory(id: number) {
    return await this.http.get<PLBSCategory>(`${environment.apiUrl}/invoice/plbsCategory/get/${id}`).toPromise();
  }



  async AddPLBSCategory(data: PLBSCategory) {
    let res = await this.http.post<PLBSCategory>(`${environment.apiUrl}/invoice/plbsCategory/create/`, data, { withCredentials: true }).toPromise();
    await this.getAllPLBSCategories();

    return res;
  }

  async UpdatePLBSCategory(input: PLBSCategory) {
    let { id, ...data } = input
    let res = await this.http.post<PLBSCategory>(`${environment.apiUrl}/invoice/plbsCategory/update/`, { id, data }, { withCredentials: true }).toPromise();
    await this.getAllPLBSCategories();

    return res;
  }

  async DeletePLBSCategory(id: number) {
    let res = await this.http.post<PLBSCategory>(`${environment.apiUrl}/invoice/plbsCategory/delete/`, { id }, { withCredentials: true }).toPromise();
    await this.getAllPLBSCategories();

    return res;
  }

  //---PLBSCategory


  //---PLBSSubCategory

  async getAllPLBSSubCategories() {
    let res = await this.http.get<PLBSSubCategory[]>(`${environment.apiUrl}/invoice/plbsSubCategory/getAll/`).toPromise();
    this.PLBSSubCategories.next(res);
    return res;
  }

  async getPLBSSubCategory(id: number) {
    return await this.http.get<PLBSSubCategory>(`${environment.apiUrl}/invoice/plbsSubCategory/get/${id}`).toPromise();
  }



  async AddPLBSSubCategory(data: PLBSSubCategory) {
    let res = await this.http.post<PLBSSubCategory>(`${environment.apiUrl}/invoice/plbsSubCategory/create/`, data, { withCredentials: true }).toPromise();
    await this.getAllPLBSSubCategories();

    return res;
  }

  async UpdatePLBSSubCategory(input: PLBSSubCategory) {
    let { id, ...data } = input
    let res = await this.http.post<PLBSSubCategory>(`${environment.apiUrl}/invoice/plbsSubCategory/update/`, { id, data }, { withCredentials: true }).toPromise();
    await this.getAllPLBSSubCategories();

    return res;
  }

  async DeletePLBSSubCategory(id: number) {
    let res = await this.http.post<PLBSSubCategory>(`${environment.apiUrl}/invoice/plbsSubCategory/delete/`, { id }, { withCredentials: true }).toPromise();
    await this.getAllPLBSSubCategories();

    return res;
  }

  //---PLBSSubCategory

  //---PLBSSubCategoryMapping

  async getPLBSSubCategoryMapping(id: number) {
    return await this.http.get<PLBSSubCatAccCodeMapping[]>(`${environment.apiUrl}/invoice/plbsSubCategoryMapping/get/${id}`).toPromise();
  }



  async AddPLBSSubCategoryMapping(data: PLBSSubCatAccCodeMapping) {
    let res = await this.http.post<PLBSSubCatAccCodeMapping>(`${environment.apiUrl}/invoice/plbsSubCategoryMapping/create/`, data, { withCredentials: true }).toPromise();
    //await this.getAllPLBSSubCategories();

    return res;
  }

  async DeletePLBSSubCategoryMapping(id: number) {
    let res = await this.http.post<PLBSSubCatAccCodeMapping>(`${environment.apiUrl}/invoice/plbsSubCategoryMapping/delete/`, { id }, { withCredentials: true }).toPromise();
    //await this.getAllPLBSSubCategories();

    return res;
  }


  async getItemByCaseType(id: number) {
    let ts = await this.http.get<Item>(`${environment.apiUrl}/invoice/getItemByCaseType/${id}`, { withCredentials: true }).toPromise();
    this.getAllItems();
    return ts;
  }
  
  //---PLBSSubCategory Mapping

}