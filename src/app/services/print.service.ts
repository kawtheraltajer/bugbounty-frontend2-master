import { Charge, Invoice } from './../interfaces/types';
import { Injectable } from '@angular/core';
import { payment } from 'src/app/interfaces/types';
import { CourtService } from 'src/app/services/court.service';
import * as moment from 'moment';
import { LanguageService } from './language.service';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
    providedIn: 'root'
})
export class PrintService {

    constructor(public Court: CourtService, public lang: LanguageService, public translate: TranslateService) { }

    async openReceipt(payment: payment, caseID: number) {
        console.log("open Receipt fun")
        console.log(caseID)
        let popupWin;
        let caseNo = '', unit = 'د.ب.';
        let Case = await this.Court.getOnecase(caseID)
        console.log("case")
        console.log(Case)
        let claim = await this.Court.getClaim(Case.id)
        caseNo = Case.CaseNo ? Case.CaseNo : '';
        let comment = payment.comment ? payment.comment : '-'
        if (this.lang.selectedLang == 'en')
            unit = "BHD"

        let amt: any = payment.amount.toFixed(2);
        let priceInWords = this.getPriceInArabicText(amt);
        popupWin = window.open('', '_blank', 'top=0,left=0,height=auto,width=30rem');
        popupWin.document.open();
        popupWin.document.write(`
        <html>
        <style>
            @media print {
                td {
                    font-size: 12px;
                }

                th,
                td {
                    padding: 5px;
                    text-align: left;
                    -webkit-print-color-adjust: exact;
                }

                th {
                    text-align: center;
                    font-size: 14px;
                    background-color: #f2f2f2 !important;
                    -webkit-print-color-adjust: exact;
                }

                table {
                    border-collapse: collapse;
                    width: 100%;
                    position: relative;
                    table-layout: fixed;
                }

                .footer {
                    position: fixed;
                    bottom: 0;
                }
            }

            @media screen {

                th,
                td {
                    padding: 5px;
                    text-align: left;
                }

                th {
                    text-align: center;
                    background-color: #f2f2f2 !important;
                }

                table {
                    border-collapse: collapse;
                    width: 100%;
                    position: relative;
                    table-layout: fixed;
                }
            }
        </style>

        <head>
            <title>إيصال-${payment.received_from}</title>
        </head>

        <body>
            <div style="text-align: center;">
                <div style="width: 38rem; display: inline-block; text-align: left;">
                    <div style="padding: 10px">
                        <button id="printbutton" type="button"
                            onclick="document.getElementById('printbutton').style.display='none'; window.print(); window.close();">
                            Print PDF
                        </button>
                    </div>
                    <br />
                    <table>
                        <tr>
                            <td>
                                Advocate
                                <br />
                                <b>Al-Qanouni</b>
                                <br />
                                Attorney at Law & Legal Consultant
                            </td>
                            <td style="text-align: center;">
                                <div style="display:inline-block">
                                    <img src="/assets/fillers/logo.png" height="100">
                                </div>
                            </td>
                            <td style="text-align: right;">
                                المحامي
                                <br />
                                <b>فيرتوثينكو</b>
                                <br />
                                محاماة و استشارات قانونية
                            </td>
                        </tr>
                        <tr>
                            <td style="text-align: center;" colspan="3">
                                <h2>إيصال</h2>
                                <h2>RECEIPT</h2>
                            </td>
                        </tr>
                        <tr>
                            <td></td>
                        </tr>
                        <tr>
                            <td>
                                VAT: 000000000000001
                            </td>
                        </tr>
                        <tr>
                            <td></td>
                        </tr>
                        <tr>
                            <td>
                                No. ${payment.paymentReceiptNo ? payment.paymentReceiptNo : ''}
                            </td>
                            <td></td>
                            <td style="text-align: right;">
                                Date ${moment(payment.chegue_date).format("DD/MM/YYYY")} التاريخ
                            </td>
                        </tr>
                        <tr>
                            <td></td>
                        </tr>
                        <tr>
                            <td>
                                Received From
                            </td>
                            <td style="text-align: center;">
                                ${payment.received_from}
                            </td>
                            <td style="text-align: right;">
                                وصل من السيد/ة
                            </td>
                        </tr>
                        <tr>
                            <td>
                                The sum of BD
                            </td>
                            <td style="text-align: center;">
                                ${unit} ${payment.amount}
                            </td>
                            <td style="text-align: right;">
                                مبلغ و قدره
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Total in words
                            </td>
                            <td style="text-align: center;">
                                ${priceInWords}
                            </td>
                            <td style="text-align: right;">
                                المبلغ الكلي بالكلمات
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Description
                            </td>
                            <td style="text-align: center;">
                                ${comment ? comment : '-'}
                            </td>
                            <td style="text-align: right;">
                                وصف
                            </td>
                        </tr>
                        <tr>
                            <td>
                                For the case No
                            </td>
                            <td style="text-align: center;">
                                ${caseNo ? caseNo : '-'}
                            </td>
                            <td style="text-align: right;">
                                وذلك عن قضية رقم
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Balance
                            </td>
                            <td style="text-align: center;">
                                ${claim.balance > 0 ? unit + ' ' + claim.balance.toFixed(2) : '-'}
                            </td>
                            <td style="text-align: right;">
                                المتبقي
                            </td>
                        </tr>

                             <tr>
                            <td>
                                Balance
                            </td>
                            <td style="text-align: center;">
                                ${claim.balance > 0 ? unit + ' ' + claim.balance.toFixed(2) : '-'}
                            </td>
                            <td style="text-align: right;">
                                المتبقي
                            </td>
                        </tr>
                        <tr>
                            <td style="text-align: center; background-color: black; color: white;" colspan="3">
                                للاستفسار الاتصال على: 33334444
                            </td>
                        </tr>
                    </table>
                    <footer class="footer">
                        <table class="no-border">
                            <tr>
                                <td colspan="2">
                                    This receipt is auto-generated by the system and does not require a stamp
                                </td>
                            </tr>
                            <tr>
                                <td style="width: 65%;">
                                    <b>T:</b> 11112222<br />
                                    <b>F:</b> 11112222<br />
                                    <b>E: admin@vt.com</b>
                                </td>
                                <td>
                                    <b>Office</b> 111, 1st Floor,<br />
                                    <b>Road</b> 2222, <b>Building</b> 234,<br />
                                    <b>Block</b> 110, Manamaa<br />
                                    <b>Manama, Kingdom of Bahrain</b>
                                </td>
                            </tr>
                        </table>
                    </footer>
                </div>
            </div>
        </body>

        </html>`
        );
        popupWin.document.close();
    }
    async printPayslip(payroll: any) {
        let popupWin;
        let items: string = ''
        let items_Allownces: string = ''
        console.log("payroll?.contract")
        let items_bounses: string = ''

        console.log(payroll?.contract)
        var total_deductions = 0
        var total_Allownces = 0
        var total_bounses = 0

        for (let i = 0; i < payroll?.contract?.deductions?.length; i++) {
            let qty = 1
            items = items + `<tr >
        <td>${payroll?.contract?.deductions[i]?.title_en}</td>
                        <td>  ${payroll?.contract?.deductions[i]?.CalculationType == 'Flat' ? payroll?.contract?.deductions[i]?.amount.toFixed(2) : (payroll?.contract?.deductions[i]?.amount / 100 * payroll?.contract?.basic_salary).toFixed(2)} </td>
          
                    </tr>`
            total_deductions = total_deductions + payroll?.contract?.deductions[i]?.CalculationType == 'Flat' ? payroll?.contract?.deductions[i]?.amount.toFixed(2) : (payroll?.contract?.deductions[i]?.amount / 100 * payroll?.contract?.basic_salary).toFixed(2)

        }

        for (let i
            = 0; i < payroll?.contract?.allowances?.length; i++) {
            let qty = 1
            items_Allownces = items_Allownces + `<tr >
                <td>${payroll?.contract?.Allownces[i]?.title_en}</td>
                                <td>  ${payroll?.contract?.allowances[i]?.CalculationType == 'Flat' ? payroll?.contract?.allowances[i]?.amount.toFixed(2) : (payroll?.contract?.allowances[i]?.amount / 100 * payroll?.contract?.basic_salary).toFixed(2)} </td>
                  
                            </tr>`
                            total_Allownces = total_Allownces + payroll?.contract?.allowances[i]?.CalculationType == 'Flat' ? payroll?.contract?.allowances[i]?.amount.toFixed(2) : (payroll?.contract?.allowances[i]?.amount / 100 * payroll?.contract?.basic_salary).toFixed(2)

        }


        for (let i = 0; i < payroll?.contract?.bonuses?.length; i++) {
            let qty = 1
            items_bounses = items_bounses + `<tr >
                        <td>${payroll?.contract?.bonuses[i]?.title_en}</td>
                          <td> ${(payroll?.contract?.bonuses[i]?.amount ).toFixed(2)} </td>
                          
                        </tr>`
                        total_bounses = total_bounses + Number(payroll?.contract?.bonuses[i]?.amount.toFixed(2))
                        console.log("total_bounses") 

                        console.log(total_bounses) 


        }
        let date = payroll.month
        popupWin = window.open('', '_blank', 'top=0,left=0,height=auto,width=30rem');
        popupWin.document.open();
        popupWin.document.write(`
        <html>
        <style>
            @media print {
                th, td {
                    padding: 5px;
                    text-align: left;
                    border: 1px solid black;
                }
                table {
                    border-collapse: collapse;
                    font-size: 10px !important;
                    width: 100%
                }
                .no-border td {
                    border: none;
                }
                .container {
                    border: 3px solid black;
                    width: 100%;
                }
                body {
                    font-family: Arial, sans-serif;
                }
                .text-right {
                    text-align: right;
                }
                .footer {
                    position: fixed;
                    bottom: 0;
                }
            }
            .h2 {
                width: 100%;
                text-align: center;
                border-bottom: 1px solid #000;
                line-height: 0.1em;
                margin: 10px 0 20px;
             }
             .h2 span {
                 background:#fff;
                 padding:0 10px;
             }
            @media screen {
                th, td {
                    padding: 5px;
                    text-align: left;
                    border: 1px solid black;
                }
                table {
                    border-collapse: collapse;
                    font-size: 10px !important;
                    width: 100%
                }
                .no-border td {
                    border: none;
                }
                .container {
                    border: 3px solid black;
                    width: 100%;
                }
                body {
                    font-family: Arial, sans-serif;
                }
                .text-right {
                    text-align: right;
                }
            }
        </style>
        <head>
            <title>Pay Slip</title>
        </head>
        <body>
            <div style="text-align: center;">
                <div style="width: 35rem; display: inline-block;">
                    <table class="no-border">
                        <tr>
                            <td>
                                <button id="printbutton" type="button"
                                    onclick="document.getElementById('printbutton').style.display='none'; window.print(); window.close();">
                                    Print PDF
                                </button>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="2">
                                    <img src="/assets/fillers/logo.png"
                                        height="50">
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <b>Al-Qanouni</b><br />
                                <b>Law Firm</b><br />
                                P.O. Box 0000, Manama , Kingdom of Bahrain<br />
                                Tel: 11112222 Fax: 11112222<br />
                                Email: admin@vt.com<br />
                            </td>
                       
                        </tr>
                        <tr>
                            <td></td>
                        </tr>
                      
                        <tr>
                            <td></td>
                        </tr>
                    </table>
                    <h2 class="h2"><span>Pay Slip</span></h2>
                    <div style="padding-bottom: 50px;"></div>
                    <table class="container" >
                        <tr class="container">
                            <td colspan="6">
                                Working Days: ${payroll?.working_days}
                                <br />
                               Pay Slip Of the month ${moment(payroll?.month).format("MMM")}  ${payroll?.year}
                                <br />
                                Employee Name : ${payroll?.contract?.employee?.user?.first_name} &nbsp; ${payroll?.contract?.employee?.user?.last_name}
                                <br />
                               Designation : ${payroll?.contract?.employee?.designation?.title_en}
                              <br />
                            </td>
                                  <td colspan="6">
                                Banking Details: 
                                <br />
                               Bank Name:  ${payroll?.contract?.employee?.personal_information?.bank_account?.bank_name ? payroll?.contract?.employee?.personal_information?.bank_account?.bank_name : "-"}
                                <br />
                                A/c : ${payroll?.contract?.employee?.personal_information?.bank_account?.account_number ? payroll?.contract?.employee?.personal_information?.bank_account?.account_number : "-"}
                                <br />
                              A/C Name : ${payroll?.contract?.employee?.personal_information?.bank_account?.holder_name ? payroll?.contract?.employee?.personal_information?.bank_account?.holder_name : "-"}
                              <br />
                            </td>
                      
                        </tr>
               
                    
                    
                    </table>
                    <table class="container">


  <tr>
    <th colspan="2" >Earnings</th>
  </tr>
  <tr>
  <td>Basic Pay</td>
  <td>${payroll?.contract?.basic_salary} </td>
  </tr> 

  <tr>
  ${items_Allownces} 
  ${items_bounses}
  <td>other Allownces</td>
  <td>${payroll?.total_allowences}</td>
</tr>
<tr>
<td>Bonus</td>
<td>${payroll?.total_bonuses}</td>
</tr>

<tr class="container" >
<th>Total Earnings</th>
<td>${payroll?.total_bonuses + payroll?.contract?.basic_salary + payroll?.total_allowences + total_bounses }  BHD</td>
</tr>
<tr>
<th colspan="2" >Deductions</th> 
 </tr>
 
 ${items} 
 <tr class="container" >
 <th>Total Deductions</th>
 <td>${total_deductions} BHD</td>
 </tr>

 
 <tr class="container" >
 <th>Net Pay</th>
 <td>${(payroll?.total_bonuses + payroll?.contract?.basic_salary + payroll?.total_allowences + total_bounses ) - (total_deductions)} BHD</td>
 </tr>
</table>

<table  class="no-border">
<tr >
<td style="text-align: left;" >
<b>This certificate is issued at the request of the the employee without any responsibility on the part of Al-Qanouni Office .</b>
</td>

</tr>
</table>   





                    <footer class="footer">
              
                    </footer>
                </div>
            </div>
        </body>
        </html>`
        );
        popupWin.document.close();
    }





    async experienceCertificate(data: any) {
        let popupWin;
        var currant_date = new Date()
        popupWin = window.open('', '_blank', 'top=0,left=0,height=auto,width=30rem');
        popupWin.document.open();
        popupWin.document.write(`
        <html>
        <style>
            @media print {
                th, td {
                    padding: 5px;
                    text-align: left;
                    border: 1px solid black;
                }
                table {
                    border-collapse: collapse;
                    font-size: 10px !important;
                    width: 100%
                }
                .no-border td {
                    border: none;
                }
                .container {
                    border: 3px solid black;
                    width: 100%;
                }
                body {
                    font-family: Arial, sans-serif;
                }
                .text-right {
                    text-align: right;
                }
                .footer {
                    position: fixed;
                    bottom: 0;
                }
            }
            .h2 {
                width: 100%;
                text-align: center;
                border-bottom: 1px solid #000;
                line-height: 0.1em;
                margin: 10px 0 20px;
             }
             .h2 span {
                 background:#fff;
                 padding:0 10px;
             }
            @media screen {
                th, td {
                    padding: 5px;
                    text-align: left;
                    border: 1px solid black;
                }
                table {
                    border-collapse: collapse;
                    font-size: 10px !important;
                    width: 100%
                }
                .no-border td {
                    border: none;
                }
                .container {
                    border: 3px solid black;
                    width: 100%;
                }
                body {
                    font-family: Arial, sans-serif;
                }
                .text-right {
                    text-align: right;
                }
            }
        </style>
        <head>
            <title>شهادة خبرة</title>
        </head>
        <head>
        <title>شهادة خبرة<</title>
    </head>
    <body>
        <div style="text-align: center;">
            <div style="width: 35rem; display: inline-block;">
                <table class="no-border">
                    <tr>
                        <td>
                            <button id="printbutton" type="button"
                                onclick="document.getElementById('printbutton').style.display='none'; window.print(); window.close();">
                                Print PDF
                            </button>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                                <img src="/assets/fillers/logo.png"
                                    height="50">
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <b>Al-Qanouni</b><br />
                            <b>Law Firm</b><br />
                            P.O. Box 0000, Manama , Kingdom of Bahrain<br />
                            Tel: 11112222 Fax: 11112222<br />
                            Email: admin@vt.com<br />
                        </td>

                        <td>
                     <b>  Date: ${moment(currant_date).format("DD-MM-yyyy")}</b>
                        <td>

                   
                    </tr>
                    <tr>
                        <td></td>
                    </tr>
                  
                    <tr>
                        <td></td>
                    </tr>
                </table>
                <h2 class="h2"><span>شهادة خبرة</span></h2>
                <div dir="rtl">
              
                <p style=" text-align: justify; padding-top: 25px;">
                يشهد مكتب فيرتوثينكو بأن السيد/ة <b>  ${data?.employee?.user?.first_name} ${data?.employee?.user?.last_name} </b>
                 <b> ${data?.employee?.personal_information?.nationality}</b>  الجنسية 

                وتحمل البطاقة الشخصية رقم <b>  ${data?.employee?.personal_information?.national_identity} </b>
                 بأنه/ا عمل/ت لدينا من تاريخ 
                <b> ${moment(data?.startDate).format("DD/MM/yyyy")}</b>
                 
                 حتى تاريخ <b>  ${moment(data?.endDate).format("DD/MM/yyyy")} </b>
                 
                 بوظيفة 
                 <b> ${data?.employee?.designation?.title_ar} </b>  براتب وقدره . 
                </p>
                <p style=" text-align: justify; ">
                و قد أعطيت له/ا هذه الشهادة وفقا لطلبه/ا دون أدنى مسؤلية على الشركة. 
</P>
<div  style=" text-align: left; padding-top: 25px;" >

<h3   >المدير الإداري </h3>
<h3>أحمد محمد </h3>
</div>


                </div>

            
                    <footer class="footer">
              
                    </footer>
                </div>
            </div>
        </body>
        </html>`
        );
        popupWin.document.close();
    }

    async salarycertificate(data: any) {
        let popupWin;
        var currant_date = new Date()
        popupWin = window.open('', '_blank', 'top=0,left=0,height=auto,width=30rem');
        popupWin.document.open();
        popupWin.document.write(`
        <html>
        <style>
            @media print {
                th, td {
                    padding: 5px;
                    text-align: left;
                    border: 1px solid black;
                }
                table {
                    border-collapse: collapse;
                    font-size: 10px !important;
                    width: 100%
                }
                .no-border td {
                    border: none;
                }
                .container {
                    border: 3px solid black;
                    width: 100%;
                }
                body {
                    font-family: Arial, sans-serif;
                }
                .text-right {
                    text-align: right;
                }
                .footer {
                    position: fixed;
                    bottom: 0;
                }
            }
            .h2 {
                width: 100%;
                text-align: center;
                border-bottom: 1px solid #000;
                line-height: 0.1em;
                margin: 10px 0 20px;
             }
             .h2 span {
                 background:#fff;
                 padding:0 10px;
             }
            @media screen {
                th, td {
                    padding: 5px;
                    text-align: left;
                    border: 1px solid black;
                }
                table {
                    border-collapse: collapse;
                    font-size: 10px !important;
                    width: 100%
                }
                .no-border td {
                    border: none;
                }
                .container {
                    border: 3px solid black;
                    width: 100%;
                }
                body {
                    font-family: Arial, sans-serif;
                }
                .text-right {
                    text-align: right;
                }
            }
        </style>
        <head>
            <title>شهادة راتب</title>
        </head>
        <head>
        <title>شهادة راتب<</title>
    </head>
    <body>
        <div style="text-align: center;">
            <div style="width: 35rem; display: inline-block;">
                <table class="no-border">
                    <tr>
                        <td>
                            <button id="printbutton" type="button"
                                onclick="document.getElementById('printbutton').style.display='none'; window.print(); window.close();">
                                Print PDF
                            </button>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                                <img src="/assets/fillers/logo.png"
                                    height="50">
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <b>Al-Qanouni</b><br />
                            <b>Law Firm</b><br />
                            P.O. Box 0000, Manama , Kingdom of Bahrain<br />
                            Tel: 11112222 Fax: 111112222<br />
                            Email: admin@vt.com<br />
                        </td>

                        <td>
                     <b>  Date: ${moment(currant_date).format("DD-MM-yyyy")}</b>
                        <td>

                   
                    </tr>
                    <tr>
                        <td></td>
                    </tr>
                  
                    <tr>
                        <td></td>
                    </tr>
                </table>
                <h2 class="h2"><span>شهادة راتب</span></h2>
                <div dir="rtl">
                <b style=" text-align: justify; padding-top: 25px;"> بسمه تعالى</b>
                <p style=" text-align: justify;">
             
                الى من يهمه الأمر،،
                <br>
                تشهد إدارة شئون الموظفين بمكتب فيرتوثينكو بأن  <b>  ${data?.employee?.user?.first_name} ${data?.employee?.user?.last_name} </b>

                الحامل/ة للبطاقة الشخصية رقم <b>  ${data?.employee?.personal_information?.national_identity} </b>
                 بأنه/ا يعمل لدينا  بمسمى  <b> ${data?.employee?.designation?.title_ar} </b> .من تاريخ 
                <b> ${moment(data?.startDate).format("DD/MM/yyyy")}</b>
                 
                ولازال على رأس العمل حتى تاريخه.       </b>
        
                </p>
                <p style=" text-align: justify; ">
                و قد أعطيت له/ا هذه الشهادة وفقا لطلبه/ا دون أدنى مسؤلية على الشركة. 
</P>
والله الموفق ،،،

<div  style=" text-align: left; padding-top: 25px;" >

<h3   >المدير الإداري </h3>
<h3> أحمد محمد </h3>
</div>


                </div>

            
                    <footer class="footer">
              
                    </footer>
                </div>
            </div>
        </body>
        </html>`
        );
        popupWin.document.close();
    }

    async openFinanceReceipt(receipt) {
        let popupWin;
        let caseNo = '', unit = 'د.ب.';
        if (receipt?.Invoice?.caseID) {
            let Case = await this.Court.getOnecase(receipt.Invoice.caseID)
            caseNo = Case.CaseNo ? Case.CaseNo : '-';
        }

        let receipient = receipt.Invoice.clientID ? (await this.Court.getOneClient(receipt.Invoice.clientID)).full_name
            : receipt.Invoice.companyID ? (await this.Court.getOneCompany(receipt.Invoice.companyID)).full_name
                : receipt.Invoice.recipient_name

        let perc = receipt?.Invoice?.InvoiceItems[0]?.item?.taxcode?.percentage
        //let tax_paid = receipt?.Invoice?.pending_amount == 0 ? receipt?.Invoice?.tax_amount : receipt.amount / (1 + perc / 100) * (perc / 100)
        let tax_paid = 0
        if (receipt?.Invoice?.invoice_status == 'Paid' && receipt?.Invoice?.InvoiceItems[1]) {
            tax_paid = receipt?.Invoice?.tax_amount
        } else if (receipt?.Invoice?.InvoiceItems.length < 2) {
            //tax_paid = receipt?.amount  * perc / 100 ;
            tax_paid = receipt?.amount / (1 + receipt?.Invoice?.InvoiceItems[0]?.item?.taxcode?.percentage / 100) * (receipt?.Invoice?.InvoiceItems[0]?.item?.taxcode?.percentage / 100)
            //tax_paid=receipt?.amount / (1 + perc) * (perc / 100) 
        }
        if (this.lang.selectedLang == 'en')
            unit = "BHD"
        //console.log(((receipt.amount + Number.EPSILON) * 1000) / 1000)
        let priceInWords = this.getPriceInArabicText(receipt.amount.toFixed(2));

        popupWin = window.open('', '_blank', 'top=0,left=0,height=auto,width=30rem');
        popupWin.document.open();
        popupWin.document.write(`
        <html>
        <style>
            @media print {
                td {
                    font-size: 12px;
                }

                th,
                td {
                    padding: 5px;
                    text-align: left;
                    -webkit-print-color-adjust: exact;
                }

                th {
                    text-align: center;
                    font-size: 14px;
                    background-color: #f2f2f2 !important;
                    -webkit-print-color-adjust: exact;
                }

                table {
                    border-collapse: collapse;
                    width: 100%;
                    position: relative;
                    table-layout: fixed;
                }

                .footer {
                    position: fixed;
                    bottom: 0;
                }
            }

            @media screen {

                th,
                td {
                    padding: 5px;
                    text-align: left;
                }

                th {
                    text-align: center;
                    background-color: #f2f2f2 !important;
                }

                table {
                    border-collapse: collapse;
                    width: 100%;
                    position: relative;
                    table-layout: fixed;
                }
            }
        </style>

        <head>
            <title>إيصال-${receipient}</title>
        </head>

        <body>
            <div style="text-align: center;">
                <div style="width: 38rem; display: inline-block; text-align: left;">
                    <div style="padding: 10px">
                        <button id="printbutton" type="button"
                            onclick="document.getElementById('printbutton').style.display='none'; window.print(); window.close();">
                            Print PDF
                        </button>
                    </div>
                    <br />
                    <table>
                        <tr>
                            <td>
                                Advocate
                                <br />
                                <b>Al-Qanouni</b>
                                <br />
                                Attorney at Law & Legal Consultant
                            </td>
                            <td style="text-align: center;">
                                <div style="display:inline-block">
                                    <img src="/assets/fillers/logo.png" height="100">
                                </div>
                            </td>
                            <td style="text-align: right;">
                                المحامي
                                <br />
                                <b>فيرتوثينكو</b>
                                <br />
                                محاماة و استشارات قانونية
                            </td>
                        </tr>
                        <tr>
                            <td style="text-align: center;" colspan="3">
                                <h2>إيصال</h2>
                                <h2>RECEIPT</h2>
                            </td>
                        </tr>
                        <tr>
                            <td></td>
                        </tr>
                        <tr>
                            <td>
                                VAT: 000000000000001
                            </td>
                        </tr>
                        <tr>
                            <td></td>
                        </tr>
                        <tr>
                            <td>
                                No. ${receipt.receipt_no}
                            </td>
                            <td></td>
                            <td style="text-align: right;">
                                Date ${moment(receipt.receipt_date).format("DD/MM/YYYY")} التاريخ
                            </td>
                        </tr>
                        <tr>
                            <td></td>
                        </tr>
                        <tr>
                            <td>
                                Received From
                            </td>
                            <td style="text-align: center;">
                                ${receipient}
                            </td>
                            <td style="text-align: right;">
                                وصل من السيد/ة
                            </td>
                        </tr>
                        <tr>
                            <td>
                                The sum of BD in Figure
                            </td>
                            <td style="text-align: center;">
                                ${unit} ${Number((receipt.amount - tax_paid)).toFixed(2)}
                            </td>
                            <td style="text-align: right;">
                                مبلغ وقدره
                            </td>
                        </tr>
                        <tr>
                            <td>
                                VAT
                            </td>
                            <td style="text-align: center;">
                                ${unit} ${(tax_paid).toFixed(2)}
                            </td>
                            <td style="text-align: right;">
                                مبلغ الضريبة
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <b>Total with VAT</b>
                            </td>
                            <td style="text-align: center;">
                                <b>${unit} ${receipt.amount.toFixed(2)}</b>
                            </td>
                            <td style="text-align: right;">
                                <b>المبلغ الكلي مع الضريبة و قدره</b>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Total in words
                            </td>
                            <td style="text-align: center;">
                                ${priceInWords}
                            </td>
                            <td style="text-align: right;">
                                المبلغ الكلي بالكلمات
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Description
                            </td>
                            <td style="text-align: center;">
                                ${receipt.description ? receipt.description : '-'}
                            </td>
                            <td style="text-align: right;">
                                وصف
                            </td>
                        </tr>
                        <tr>
                            <td>
                                For the case No
                            </td>
                            <td style="text-align: center;">
                                ${caseNo ? caseNo : '-'}
                            </td>
                            <td style="text-align: right;">
                                وذلك عن قضية رقم
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Payment Method
                            </td>
                            <td style="text-align: center;">
                                ${this.translate.instant('Finance.Receipt.Payment_method.' + receipt.payment_method)}
                            </td>
                            <td style="text-align: right;">
                                طريقة القبض
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Balance
                            </td>
                            <td style="text-align: center;">
                                ${receipt?.Invoice?.pending_amount > 0 ? unit + ' ' + receipt?.Invoice?.pending_amount.toFixed(2) : '-'}
                            </td>
                            <td style="text-align: right;">
                                المتبقي
                            </td>
                        </tr>
                        <tr>
                            <td style="text-align: center; background-color: black; color: white;" colspan="3">
                                للاستفسار الاتصال على: 17514156
                            </td>
                        </tr>
                    </table>
                    <footer class="footer">
                        <table class="no-border">
                            <tr>
                                <td colspan="2">
                                    This receipt is auto-generated by the system and does not require a stamp
                                </td>
                            </tr>
                            <tr>
                                <td style="width: 65%;">
                                    <b>T:</b> 11112222<br />
                                    <b>F:</b> 11112222<br />
                                    <b>E: admin@vt.com</b>
                                </td>
                                <td>
                                    <b>Office</b> 111, 1st Floor,<br />
                                    <b>Road</b> 222, <b>Building</b> 234,<br />
                                    <b>Block</b> 333, Manama<br />
                                    <b>Manama, Kingdom of Bahrain</b>
                                </td>
                            </tr>
                        </table>
                    </footer>
                </div>
            </div>
        </body>

        </html>`
        );
        popupWin.document.close();
    }

    public printDiv(printContents: any, title: string) {
        let popupWin, alignment, dir;
        if (this.lang.selectedLang == 'en') {
            alignment = "left"
            dir = "ltr"
        }
        else {
            alignment = "right"
            dir = "rtl"
        }

        popupWin = window.open('', '_blank', 'top=0,left=0,height=auto,width=auto');
        popupWin.document.open();
        popupWin.document.write(`
          <html>
            <style>
              @media print {
                td {
                  font-size: 12px;
                }
                th, td {
                  border: 1px solid black;
                  padding: 5px;
                  text-align: ${alignment};
                }
                th {
                  text-align: center;
                  font-size: 14px;
                  background-color: #f2f2f2 !important;
                  -webkit-print-color-adjust: exact;
                }
                table {
                  border-collapse: collapse;
                  width: 100%;
                  position: relative;
                }
                img {
                  float: right;
                  position: relative;
                  padding-bottom: 1em;
                }
              }
              @media screen
              {
                th, td {
                  border: 1px solid black;
                  padding: 5px;
                  text-align: ${alignment};
                }
                th {
                  text-align: center;
                  background-color: #f2f2f2 !important;
                }
                table {
                  border-collapse: collapse;
                  width: 100%;
                  position: relative;
                }
                img {
                  float: right;
                  position: relative;
                  padding-bottom: 1em;
                }
              }
            </style>
            <head>
              <title>${title}</title>
            </head>
            <body>
              <button id="printbutton" type="button" onclick="document.getElementById('printbutton').style.display='none'; window.print(); window.close();">
                  Print PDF
              </button>
              <img _ngcontent-hup-c585="" src="../../../../assets/fillers/logo.png" height="100" alt="">
              <div style="padding-top:1rem;">
              <table class="table table-bordered" dir="${dir}">
                ${printContents}
              </table>
              </div>
            </body>
          </html>`
        );
        popupWin.document.close();
    }

    async printCharge(charge: Charge, caseID: number) {
        let popupWin;
        let casee, showcase = '', unit = 'د.ب.';

        if (charge.caseId) {
            casee = await this.Court.getOnecase(charge.caseId);
            showcase = `<tr>
             <td>
                 For the case No
             </td>
             <td style="text-align: center;">
                 ${casee?.CaseNo ? casee?.CaseNo : '-'}
             </td>
             <td style="text-align: right;">
                 وذلك عن قضية رقم
             </td>
         </tr>`

        }
        if (this.lang.selectedLang == 'en')
            unit = "BHD"
        let amt: any = charge.Amounts.toFixed(2);
        let priceInWords = this.getPriceInArabicText(amt);
        popupWin = window.open('', '_blank', 'top=0,left=0,height=auto,width=30rem');
        popupWin.document.open();
        popupWin.document.write(`
        <html>
        <style>
            @media print {
                td {
                    font-size: 12px;
                }

                th,
                td {
                    padding: 5px;
                    text-align: left;
                    -webkit-print-color-adjust: exact;
                }

                th {
                    text-align: center;
                    font-size: 14px;
                    background-color: #f2f2f2 !important;
                    -webkit-print-color-adjust: exact;
                }

                table {
                    border-collapse: collapse;
                    width: 100%;
                    position: relative;
                    table-layout: fixed;
                }

                .footer {
                    position: fixed;
                    bottom: 0;
                }
            }

            @media screen {

                th,
                td {
                    padding: 5px;
                    text-align: left;
                }

                th {
                    text-align: center;
                    background-color: #f2f2f2 !important;
                }

                table {
                    border-collapse: collapse;
                    width: 100%;
                    position: relative;
                    table-layout: fixed;
                }
            }
        </style>

        <head>
            <title>إيصال-${charge?.recipient_name}</title>
        </head>

        <body>
            <div style="text-align: center;">
                <div style="width: 38rem; display: inline-block; text-align: left;">
                    <div style="padding: 10px">
                        <button id="printbutton" type="button"
                            onclick="document.getElementById('printbutton').style.display='none'; window.print(); window.close();">
                            Print PDF
                        </button>
                    </div>
                    <br />
                    <table>
                        <tr>
                            <td>
                                Advocate
                                <br />
                                <b>Al-Qanouni/b>
                                <br />
                                Attorney at Law & Legal Consultant
                            </td>
                            <td style="text-align: center;">
                                <div style="display:inline-block">
                                    <img src="/assets/fillers/logo.png" height="100">
                                </div>
                            </td>
                            <td style="text-align: right;">
                                المحامي
                                <br />
                                <b>فيرتوثينكو</b>
                                <br />
                                محاماة و استشارات قانونية
                            </td>
                        </tr>
                        <tr>
                            <td style="text-align: center;" colspan="3">
                                <h2>إيصال</h2>
                                <h2>RECEIPT</h2>
                            </td>
                        </tr>
                        <tr>
                            <td></td>
                        </tr>
                        <tr>
                            <td>
                                VAT: 000000000000001
                            </td>
                        </tr>
                        <tr>
                            <td></td>
                        </tr>
                        <tr>
                            <td>
                                No. ${charge.reference_no ? charge.reference_no : '-'}
                            </td>
                            <td></td>
                            <td style="text-align: right;">
                                Date ${moment(charge.Date).format("DD/MM/YYYY")} التاريخ
                            </td>
                        </tr>
                        <tr>
                            <td></td>
                        </tr>
                        <tr>
                            <td>
                                Received From
                            </td>
                            <td style="text-align: center;">
                                ${charge?.recipient_name}
                            </td>
                            <td style="text-align: right;">
                                وصل من السيد/ة
                            </td>
                        </tr>
                        <tr>
                            <td>
                                The sum of BD
                            </td>
                            <td style="text-align: center;">
                                ${unit} ${charge.Amounts.toFixed(2)}
                            </td>
                            <td style="text-align: right;">
                                مبلغ و قدره
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Total in words
                            </td>
                            <td style="text-align: center;">
                                ${priceInWords}
                            </td>
                            <td style="text-align: right;">
                                المبلغ الكلي بالكلمات
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Description
                            </td>
                            <td style="text-align: center;">
                                ${charge.Comments ? charge.Comments : '-'}
                            </td>
                            <td style="text-align: right;">
                                وصف
                            </td>
                        </tr>
                        ${showcase}
                        <tr>
                            <td>
                                Payment Method
                            </td>
                            <td style="text-align: center;">
                                -
                            </td>
                            <td style="text-align: right;">
                                طريقة القبض
                            </td>
                        </tr>
                        <tr>
                            <td style="text-align: center; background-color: black; color: white;" colspan="3">
                                للاستفسار الاتصال على: 17514156
                            </td>
                        </tr>
                    </table>
                    <footer class="footer">
                        <table class="no-border">
                            <tr>
                                <td colspan="2">
                                    This receipt is auto-generated by the system and does not require a stamp
                                </td>
                            </tr>
                            <tr>
                                <td style="width: 65%;">
                                    <b>T:</b> 11112222<br />
                                    <b>F:</b> 11112222<br />
                                    <b>E: admin@vt.com</b>
                                </td>
                                <td>
                                    <b>Office</b> 111, 1st Floor,<br />
                                    <b>Road</b> 222, <b>Building</b> 234,<br />
                                    <b>Block</b> 333, Manama<br />
                                    <b>Manama, Kingdom of Bahrain</b>
                                </td>
                            </tr>
                        </table>
                    </footer>
                </div>
            </div>
        </body>

        </html>`
        );
        /*popupWin.document.write(`
        <html>
        <style>
            @media print {
                td {
                    font-size: 12px;
                }

                th,
                td {
                    padding: 5px;
                    text-align: left;
                    -webkit-print-color-adjust: exact;
                }

                th {
                    text-align: center;
                    font-size: 14px;
                    background-color: #f2f2f2 !important;
                    -webkit-print-color-adjust: exact;
                }

                table {
                    border-collapse: collapse;
                    width: 100%;
                    position: relative;
                    table-layout: fixed ;
                }
            }

            @media screen {

                th,
                td {
                    padding: 5px;
                    text-align: left;
                }

                th {
                    text-align: center;
                    background-color: #f2f2f2 !important;
                }

                table {
                    border-collapse: collapse;
                    width: 100%;
                    position: relative;
                    table-layout: fixed ;
                }
            }
        </style>

        <head>
            <title>إيصال-${charge?.recipient_name}</title>
        </head>

        <body>
            <div style="text-align: center;">
                <div style="width: 38rem; display: inline-block; text-align: left;">
                    <div style="padding: 10px">
                        <button id="printbutton" type="button"
                            onclick="document.getElementById('printbutton').style.display='none'; window.print(); window.close();">
                            Print PDF
                        </button>
                    </div>
                    <br />
                    <table>
                        <tr>
                            <td>
                                Advocate
                                <br />
                                <b>Al-Qanouni</b>
                                <br />
                                Attorney at Law & Legal Consultant
                            </td>
                            <td style="text-align: center;">
                                <div style="display:inline-block">
                                    <img src="/assets/fillers/logo.png"
                                        height="100">
                                </div>
                            </td>
                            <td style="text-align: right;">
                                المحامي
                                <br />
                                <b>فيرتوثينكو</b>
                                <br />
                                محاماة و استشارات قانونية
                            </td>
                        </tr>
                        <tr>
                            <td style="text-align: center;" colspan="3">
                                <h2>إيصال</h2>
                                <h2>RECEIPT</h2>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                No. ${charge.reference_no ? charge.reference_no : '-'}
                            </td>
                            <td></td>
                            <td style="text-align: right;">
                                Date ${moment(charge.Date).format("DD/MM/YYYY")} التاريخ
                            </td>
                        </tr>
                        <tr><td></td></tr>
                        <tr>
                            <td>
                                Received From
                            </td>
                            <td style="text-align: center;">
                                ${charge?.recipient_name}
                            </td>
                            <td style="text-align: right;">
                                وصل من السيد/ة
                            </td>
                        </tr>
                        <tr>
                            <td>
                                The sum of BD
                            </td>
                            <td style="text-align: center;">
                                د.ب. ${charge.Amounts}
                            </td>
                            <td style="text-align: right;">
                                مبلغ و قدره
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Being rent of
                            </td>
                            <td style="text-align: center;">
                                ${charge?.ChargeType?.name_ar ? charge?.ChargeType?.name_ar : '-'}
                            </td>
                            <td style="text-align: right;">
                                وذلك عن
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Description
                            </td>
                            <td style="text-align: center;">
                                ${charge.Comments ? charge.Comments : '-'}
                            </td>
                            <td style="text-align: right;">
                                وصف
                            </td>
                        </tr>
                        ${showcase}
                        <tr>
                            <td>
                                Payment Method
                            </td>
                            <td style="text-align: center;">
                                -
                            </td>
                            <td style="text-align: right;">
                                طريقة القبض
                            </td>
                        </tr>
                        <tr>
                            <td style="text-align: center; background-color: black; color: white;" colspan="3">
                                للاستفسار الاتصال على: 17514156
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
        </body>

        </html>`
        );*/
        popupWin.document.close();
    }

    async printInvoice(invoice: Invoice) {
        let popupWin;
        let date = invoice.invoice_date
        let receipient = invoice.clientID ? (await this.Court.getOneClient(invoice.clientID)).full_name
            : invoice.companyID ? (await this.Court.getOneCompany(invoice.companyID)).full_name
                : invoice.recipient_name
        let items: string = ''
        for (let i = 0; i < invoice.InvoiceItems.length; i++) {
            let qty = 1
            items = items + `<tr class="table-container">
                        <td>${i + 1}</td>
                        <td>${invoice.InvoiceItems[i].item.description ? invoice.InvoiceItems[i].item.description : invoice.InvoiceItems[i].item.name}</td>
                        <td>${invoice.InvoiceItems[i].item.description ? invoice.InvoiceItems[i].item.description : '-'}</td>
                        <td>${qty}</td>
                        <td>${(Math.round((invoice.InvoiceItems[i].gross_amount + Number.EPSILON) * 1000) / 1000).toFixed(2)}</td>
                        <td>${(Math.round(((invoice.InvoiceItems[i].net_amount - invoice.InvoiceItems[i].gross_amount) * qty))).toFixed(2)}(${invoice?.InvoiceItems[i]?.item?.taxcode?.percentage}%)</td>
                        <td>${(Math.round(((invoice.InvoiceItems[i].gross_amount * qty) + Number.EPSILON) * 1000) / 1000).toFixed(2)}</td>
                    </tr>`
        }
        let discount = 0
        let net = invoice.net_amount - discount
        let priceInWords = this.getPriceInText(Math.round((net + Number.EPSILON) * 1000) / 1000);
        popupWin = window.open('', '_blank', 'top=0,left=0,height=auto,width=30rem');
        popupWin.document.open();
        popupWin.document.write(`
        <html>
        <style>
            @media print {
                th, td {
                    padding: 5px;
                    text-align: left;
                    border: 1px solid black;
                }
                table {
                    border-collapse: collapse;
                    font-size: 10px !important;
                    width: 100%
                }
                .no-border td {
                    border: none;
                }
                .container {
                    border: 3px solid black;
                    width: 100%;
                }
                body {
                    font-family: Arial, sans-serif;
                }
                .text-right {
                    text-align: right;
                }
                .footer {
                    position: fixed;
                    bottom: 0;
                }
            }
            .h2 {
                width: 100%;
                text-align: center;
                border-bottom: 1px solid #000;
                line-height: 0.1em;
                margin: 10px 0 20px;
             }
             .h2 span {
                 background:#fff;
                 padding:0 10px;
             }
            @media screen {
                th, td {
                    padding: 5px;
                    text-align: left;
                    border: 1px solid black;
                }
                table {
                    border-collapse: collapse;
                    font-size: 10px !important;
                    width: 100%
                }
                .no-border td {
                    border: none;
                }
                .container {
                    border: 3px solid black;
                    width: 100%;
                }
                body {
                    font-family: Arial, sans-serif;
                }
                .text-right {
                    text-align: right;
                }
            }
        </style>
        <head>
            <title>Tax Invoice</title>
        </head>
        <body>
            <div style="text-align: center;">
                <div style="width: 35rem; display: inline-block;">
                    <table class="no-border">
                        <tr>
                            <td>
                                <button id="printbutton" type="button"
                                    onclick="document.getElementById('printbutton').style.display='none'; window.print(); window.close();">
                                    Print PDF
                                </button>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="2">
                                    <img src="/assets/fillers/logo.png"
                                        height="50">
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <b>Virtutinko</b><br />
                                <b>Law Firm</b><br />
                                P.O. Box 0000, Manama , Kingdom of Bahrain<br />
                                Tel: 11112222 Fax: 11112222<br />
                                Email: admin@vt.com<br />
                            </td>
                            <td style="text-align: right;">
                                <h5>${moment(date).format("Do/MMM/YYYY")}</h5>
                                <h5>Invoice No: <b>${invoice.invoice_no}</b></h5>
                            </td>
                        </tr>
                        <tr>
                            <td></td>
                        </tr>
                        <tr>
                            <td>
                                VAT: 000000000000001
                            </td>
                        </tr>
                        <tr>
                            <td></td>
                        </tr>
                    </table>
                    <h2 class="h2"><span>Tax Invoice</span></h2>
                    <table class="container">
                        <tr class="container">
                            <td colspan="7">
                                Invoice To: ${receipient}
                                <br />
                                Bahrain
                                <br />
                                Case : ${invoice?.case?.CaseNo ? invoice?.case?.CaseNo : '-'}
                                <br />
                               Note : ${invoice?.comments ? invoice?.comments : '-'}
                              <br />
                            </td>
                      
                        </tr>
                        <tr class="container">
                            <td colspan="7"></td>
                        </tr>
                        <tr>
                            <td colspan="7"></td>
                        </tr>
                        <tr class="table-container">
                            <th>ITEM</th>
                            <th>ITEM NAME</th>
                            <th>DESCRIPTION</th>
                            <th>QUANTITY</th>
                            <th>UNIT PRICE</th>
                            <th>VAT AMOUNT</th>
                            <th>TOTAL PRICE</th>
                        </tr>
                        ${items}
                        <tr class="no-border">
                            <td colspan="6" class="text-right">Total</td>
                            <td><u>${(Math.round((invoice.gross_amount + Number.EPSILON) * 1000) / 1000).toFixed(2)}</u></td>
                        </tr>
                        <tr class="no-border">
                            <td colspan="6" class="text-right">VAT</td>
                            <td>${(Math.round((invoice.tax_amount + Number.EPSILON) * 1000) / 1000).toFixed(2)}</td>
                        </tr>
                        <tr class="no-border">
                            <td colspan="6" class="text-right">Discount</td>
                            <td>${discount > 0 ? (Math.round((discount + Number.EPSILON) * 1000) / 1000).toFixed(2) : '-'}</td>
                        </tr>
                        <tr class="no-border">
                            <td colspan="6" class="text-right"><b>Net</b></td>
                            <td><b><u>${(Math.round((net + Number.EPSILON) * 1000) / 1000).toFixed(2)}</u></b></td>
                        </tr>
                        <tr class="container">
                            <td colspan="7">
                                ${priceInWords}
                            </td>
                        </tr>
                    </table>
                    <table class="no-border">
                        <tr>
                            <td></td>
                        </tr>
                        <tr>
                            <td>
                                <u>Payment terms:- Immediate </u>
                            </td>
                        </tr>
                        <tr>
                            <td></td>
                        </tr>
                        <tr>
                            <td>
                                Payment in advance<br />
                                Payment is not refundable<br />
                                Payment means full acceptance of related Invoice<br /><br />
                                Banking Payment to:-<br />
                                -Bank Account Name: Al-Qanouni<br />
                                -A/C No. 100000000001<br />
                                -IBAN: BH00000000000000000001<br />
                                -Bank Swift Code: XYZXXYZX
                            </td>
                            <td>
                                <img src="/assets/fillers/Benefit-QR.jpeg"
                                        height="110">
                            </td>
                        </tr>
                        <tr>
                            <td></td>
                        </tr>
                        <tr>
                            <td>Payment in favor to Al-Qanouni</td>
                        </tr>
                    </table>
                    <footer class="footer">
                        <table class="no-border">
                            <tr>
                                <td colspan="2">
                                    This invoice is auto-generated by the system and does not require a stamp
                                </td>
                            </tr>
                            <tr>
                                <td style="width: 65%;">
                                    <b>T:</b> 11112222<br />
                                    <b>F:</b> 11112222<br />
                                    <b>E: admin@vt.com</b>
                                </td>
                                <td>
                                    <b>Office</b> 111, 1st Floor,<br />
                                    <b>Road</b> 222, <b>Building</b> 234,<br />
                                    <b>Block</b> 333, MAnama<br />
                                    <b>Manama, Kingdom of Bahrain</b>
                                </td>
                            </tr>
                        </table>
                    </footer>
                </div>
            </div>
        </body>
        </html>`
        );
        popupWin.document.close();
    }



    public printData(data: any[], headers: any[], title: string, data2?: any[], AgendaSessions?: boolean, date?: any) {
        let popupWin, alignment, dir;
        if (this.lang.selectedLang == 'en') {
            alignment = "left"
            dir = "ltr"
        }
        else {
            alignment = "right"
            dir = "rtl"
        }

        let content = ''
        if (AgendaSessions) {
            let title1 = '', title2 = '', sessionsTitle = '', dateFormat
            if (this.lang.selectedLang == 'en') {
                sessionsTitle = "Sessions"
                dateFormat = 'From ' + moment(date.toDateString()).format("DD/MM/YYYY") + " to " + moment(date.toDateString()).format("DD/MM/YYYY")
                if (data.length > 0)
                    title1 = "Lawful Court"
                if (data2.length > 0)
                    title2 = "Other Courts"
                alignment = "left"
                dir = "ltr"
            }
            else {
                sessionsTitle = "الجلسات"
                dateFormat = 'من ' + moment(date.toDateString()).format("DD/MM/YYYY") + " إلى " + moment(date.toDateString()).format("DD/MM/YYYY")
                if (data.length > 0)
                    title1 = 'المحاكم الشرعية'
                if (data2.length > 0)
                    title2 = 'المحاكم الأخرى'
                alignment = "right"
                dir = "rtl"
            }
            content = `<div style="padding-top:5rem;">
            <h1 align="center">${sessionsTitle}</h1>
            <h4 dir= ${dir}>${dateFormat}</h4>
            <h4 align="center" style="padding-top:2rem;" >${title1}</h4>
            <table class="table table-bordered"  dir= ${dir}>
            <tr>`
            for (let i = 0; i < headers.length; i++) {
                content = content + `<th>${headers[i].name}</th>`
            }
            content = content + `</tr>
            </table>
            </br>
            <h4 align="center" style="padding-top:2rem;" >${title2}</h4>
            <table class="table table-bordered"  dir= ${dir}>`
            for (let i = 0; i < data.length; i++) {
                content = content + '<tr>'
                for (let j = 0; j < headers.length; j++)
                    content = content + `<td>${data[i][headers[j].name]}</td>`
                content = content + '</tr>'
            }
            content = content + `</tr>
            </table>`
        }
        else {
            content = `<table class="table table-bordered"  dir= ${dir}>`
            for (let i = 0; i < headers.length; i++) {
                content = content + `<th>${headers[i].name}</th>`
            }
            content = content + '</tr>'

            for (let i = 0; i < data.length; i++) {
                content = content + '<tr>'
                for (let j = 0; j < headers.length; j++)
                    content = content + `<td>${data[i][headers[j].name]}</td>`
                content = content + '</tr>'
            }
            content = content + '</table>'
        }

        popupWin = window.open('', '_blank', 'top=0,left=0,height=auto,width=auto');
        popupWin.document.open();
        popupWin.document.write(`
          <html>
            <style>
              @media print {
                td {
                  font-size: 12px;
                }
                th, td {
                  border: 1px solid black;
                  padding: 5px;
                  text-align: ${alignment};
                }
                th {
                  text-align: center;
                  font-size: 14px;
                  background-color: #f2f2f2 !important;
                  -webkit-print-color-adjust: exact;
                }
                table {
                  border-collapse: collapse;
                  width: 100%;
                  position: relative;
                }
                img {
                  float: right;
                  position: relative;
                  padding-bottom: 1em;
                }
              }
              @media screen
              {
                th, td {
                  border: 1px solid black;
                  padding: 5px;
                  text-align: ${alignment};
                }
                th {
                  text-align: center;
                  background-color: #f2f2f2 !important;
                }
                table {
                  border-collapse: collapse;
                  width: 100%;
                  position: relative;
                }
                img {
                  float: right;
                  position: relative;
                  padding-bottom: 1em;
                }
              }
            </style>
            <head>
              <title>${title}</title>
            </head>
            <body>
              <button id="printbutton" type="button" onclick="document.getElementById('printbutton').style.display='none'; window.print(); window.close();">
                  Print PDF
              </button>
              <img _ngcontent-hup-c585="" src="../../../../assets/fillers/logo.png" height="100" alt="">
              <div style="padding-top:1rem;">
                ${content}
              </div>
            </body>
          </html>`
        );
        popupWin.document.close();
    }


    public getPriceInText(price: number) {
        let text = this.toWordsconver(Math.trunc(price))
        text = text == 'one' ? text + ' Bahraini Dinar' : text + ' Bahraini Dinars '
        let decimal = Math.round((price % 1) * 1000)
        if (decimal > 0)
            text = text + ' and ' + this.toWordsconver(decimal) + ' Fils '
        text = text + 'only.'
        return this.capitalizeFirstLetter(text)
    }

    public getPriceInArabicText(price: number) {
        let dinars = Math.trunc(price)
        let text = this.floatToCardinal(dinars);
        let temp = dinars.toString()
        let ones = parseInt(temp[temp.length - 1])
        let tens = temp[temp.length - 2] ? parseInt(temp[temp.length - 2]) : -1
        text = ((ones > 2 && tens == 0) || (tens == 1 && ones == 0) || (ones > 2 && temp.length == 1)) ? text + ' دنانير بحرينية ' : text + ' دينار بحريني '
        let decimal = Math.round((price % 1) * 1000)
        if (decimal > 0)
            text = text + ' و ' + this.floatToCardinal(Math.trunc(decimal)) + ' فلس '
        return text
    }

    public capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    public toWordsconver(s) {
        // System for American Numbering 
        var th_val = ['', 'thousand', 'million', 'billion', 'trillion'];
        // System for uncomment this line for Number of English 
        // var th_val = ['','thousand','million', 'milliard','billion'];

        var dg_val = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
        var tn_val = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
        var tw_val = ['twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
        s = s.toString();
        s = s.replace(/[\, ]/g, '');
        if (s != parseFloat(s))
            return 'not a number ';
        var x_val = s.indexOf('.');
        if (x_val == -1)
            x_val = s.length;
        if (x_val > 15)
            return 'too big';
        var n_val = s.split('');
        var str_val = '';
        var sk_val = 0;
        for (var i = 0; i < x_val; i++) {
            if ((x_val - i) % 3 == 2) {
                if (n_val[i] == '1') {
                    str_val += tn_val[Number(n_val[i + 1])] + ' ';
                    i++;
                    sk_val = 1;
                } else if (n_val[i] != 0) {
                    str_val += tw_val[n_val[i] - 2] + ' ';
                    sk_val = 1;
                }
            } else if (n_val[i] != 0) {
                str_val += dg_val[n_val[i]] + ' ';
                if ((x_val - i) % 3 == 0)
                    str_val += 'hundred ';
                sk_val = 1;
            }
            if ((x_val - i) % 3 == 1) {
                if (sk_val)
                    str_val += th_val[(x_val - i - 1) / 3] + ' ';
                sk_val = 0;
            }
        }
        if (x_val != s.length) {
            var y_val = s.length;
            str_val += 'point ';
            for (let i = x_val + 1; i < y_val; i++)
                str_val += dg_val[n_val[i]] + ' ';
        }
        return str_val.replace(/\s+/g, ' ');
    }

    integerValue = 0;;
    decimalValue = 0;
    negativeWord = 'ناقص';
    separatorWord = 'فاصلة';
    number = 0;
    zero = 'صفر';
    arabicOnes = [
        '', 'واحد', 'اثنان', 'ثلاثة', 'أربعة', 'خمسة', 'ستة', 'سبعة', 'ثمانية',
        'تسعة',
        'عشرة', 'أحد عشر', 'اثنا عشر', 'ثلاثة عشر', 'أربعة عشر', 'خمسة عشر',
        'ستة عشر', 'سبعة عشر', 'ثمانية عشر',
        'تسعة عشر',
    ];
    arabicFeminineOnes = [
        '', 'إحدى', 'اثنتان', 'ثلاث', 'أربع', 'خمس', 'ست', 'سبع', 'ثمان',
        'تسع',
        'عشر', 'إحدى عشرة', 'اثنتا عشرة', 'ثلاث عشرة', 'أربع عشرة',
        'خمس عشرة', 'ست عشرة', 'سبع عشرة', 'ثماني عشرة',
        'تسع عشرة',
    ];
    arabicTens = ['عشرون', 'ثلاثون', 'أربعون', 'خمسون', 'ستون', 'سبعون', 'ثمانون', 'تسعون'];
    arabicHundreds = ['', 'مائة', 'مئتان', 'ثلاثمائة', 'أربعمائة', 'خمسمائة', 'ستمائة', 'سبعمائة', 'ثمانمائة', 'تسعمائة'];
    arabicAppendedTwos = ['مئتا', 'ألفا', 'مليونا', 'مليارا', 'تريليونا', 'كوادريليونا', 'كوينتليونا', 'سكستيليونا'];
    arabicTwos = ['مئتان', 'ألفان', 'مليونان', 'ملياران', 'تريليونان', 'كوادريليونان', 'كوينتليونان', 'سكستيليونان'];
    arabicGroup = ['مائة', 'ألف', 'مليون', 'مليار', 'تريليون', 'كوادريليون', 'كوينتليون', 'سكستيليون'];
    arabicAppendedGroup = ['', 'ألفاً', 'مليوناً', 'ملياراً', 'تريليوناً', 'كوادريليوناً', 'كوينتليوناً', 'سكستيليوناً'];
    arabicPluralGroups = ['', 'آلاف', 'ملايين', 'مليارات', 'تريليونات', 'كوادريليونات', 'كوينتليونات', 'سكستيليونات'];

    public toArabicWordsConvarter(num) {
        return this.floatToCardinal(num)
    }

    public digitFeminineStatus(digit, groupLevel?) {
        return this.arabicOnes[digit];
    }

    public processArabicGroup(groupNumber, groupLevel, remainingNumber) {
        let tens = groupNumber % 100;
        const hundreds = groupNumber / 100;
        let retVal = '';
        if (Math.floor(hundreds) >= 1) {
            retVal = (
                tens == 0 && Math.floor(hundreds) == 2
            ) ? this.arabicAppendedTwos[0] : this.arabicHundreds[Math.floor(hundreds)];
        }
        if (tens >= 1) {
            if (tens < 20) {
                if (tens == 2 && Math.floor(hundreds) == 0 && groupLevel > 0) {
                    retVal = ([
                        2000, 2000000, 2000000000, 2000000000000, 2000000000000000, 2000000000000000000
                    ].indexOf(this.integerValue) != -1) ? this.arabicAppendedTwos[groupLevel] : this.arabicTwos[groupLevel];
                } else {
                    if (retVal != '') {
                        retVal += ' و ';
                    }
                    if (tens == 1 && groupLevel > 0 && Math.floor(hundreds) == 0) {
                        retVal += '_';
                    } else if (
                        (tens == 1 || tens == 2) && (groupLevel == 0 || groupLevel == -1) &&
                        (Math.floor(hundreds) == 0 && remainingNumber == 0)
                    ) {
                        retVal += '';
                    } else {
                        retVal += this.digitFeminineStatus(tens, groupLevel);
                    }
                }
            } else {
                const ones = tens % 10;
                tens = Math.floor(tens / 10) - 2;
                if (ones >= 1) {
                    if (retVal != '') {
                        retVal += ' و ';
                    }
                    retVal += this.digitFeminineStatus(ones, groupLevel);
                }
                if (retVal != '' && ones != 0) {
                    retVal += ' و ';
                }
                if (retVal != '' && tens != 0 && ones == 0) {
                    retVal += ' و ';
                }
                retVal = this.arabicTens[tens] ? retVal + this.arabicTens[tens] : retVal;
            }
        }
        return retVal;
    }

    public toCardinal(number) {
        let self = this
        if (number == 0) {
            return this.zero;
        }
        let tempNumber = number;
        self.integerValue = number;
        let retVal = '';
        let group = 0;
        while (tempNumber >= 1) {
            const numberToProcess = Math.trunc(tempNumber % 1000);
            tempNumber = tempNumber / 1000;
            const groupDescription = self.processArabicGroup(numberToProcess, group, Math.floor(tempNumber));
            if (groupDescription != '') {
                if (group >= 1) {
                    if (retVal != '') {
                        retVal = ' و ' + retVal;
                    }
                    if (numberToProcess != 2) {
                        if (numberToProcess % 100 != 1) {
                            if (numberToProcess >= 3 && numberToProcess <= 10) {
                                retVal = self.arabicPluralGroups[group] + ' ' + retVal;
                            } else {
                                if (retVal != '') {
                                    retVal = self.arabicAppendedGroup[group] + ' ' + retVal;
                                } else {
                                    retVal = self.arabicGroup[group] + ' ' + retVal;
                                }
                            }
                        } else {
                            retVal = self.arabicGroup[group] + ' ' + retVal;
                        }
                    }
                }
                retVal = groupDescription == '_' ? retVal : groupDescription + ' ' + retVal;
            }
            group += 1;
        }
        return retVal.trim();
    }

    floatToCardinal(value) {
        if (isNaN(Number(value))) {
            throw new TypeError(`Invalid number: ${value}, of type: ${typeof value}`);
        }
        value = Number(value);
        let words = [];
        let positiveValue = Math.abs(value);
        if (value % 1 === 0 || typeof this.separatorWord === 'undefined') {
            // if value is integer or if separatorWord is not defined
            //words = [this.toCardinal(positiveValue)];
            return this.toCardinal(positiveValue)
        } else {
            //no else for now
        }
    }

    public printPDF(printContents: any, title: string) {
        let popupWin, alignment, dir;
        if (this.lang.selectedLang == 'en') {
            alignment = "left"
            dir = "ltr"
        }
        else {
            alignment = "right"
            dir = "rtl"
        }

        popupWin = window.open('', '_blank', 'top=0,left=0,height=auto,width=auto');
        popupWin.document.open();
        popupWin.document.write(`
          <html>
            <style>
              @media print {
                td {
                  font-size: 12px;
                }
                th, td {
                  border: 1px solid black;
                  padding: 5px;
                  text-align: ${alignment};
                }
                th {
                  text-align: center;
                  font-size: 14px;
                  background-color: #f2f2f2 !important;
                  -webkit-print-color-adjust: exact;
                }
                table {
                  border-collapse: collapse;
                  width: 100%;
                  position: relative;
                }
                img {
                  float: right;
                  position: relative;
                  padding-bottom: 1em;
                }
              }
              @media screen
              {
                th, td {
                  border: 1px solid black;
                  padding: 5px;
                  text-align: ${alignment};
                }
                th {
                  text-align: center;
                  background-color: #f2f2f2 !important;
                }
                table {
                  border-collapse: collapse;
                  width: 100%;
                  position: relative;
                }
                img {
                  float: right;
                  position: relative;
                  padding-bottom: 1em;
                }
              }
            </style>
            <head>
              <title>${title}</title>
            </head>
            <body>
              <button id="printbutton" type="button" onclick="document.getElementById('printbutton').style.display='none'; window.print(); window.close();">
                  Print PDF
              </button>
              <img _ngcontent-hup-c585="" src="../../../../assets/fillers/logo.png" height="100" alt="">
              <div style="padding-top:1rem;">
              <table class="table table-bordered" dir="${dir}">
                ${printContents}
              </table>
              </div>
            </body>
          </html>`
        );
        popupWin.document.close();
    }


}