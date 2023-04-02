import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthzService } from 'src/app/services/authz.service';
import { LanguageService } from 'src/app/services/language.service';
@Component({
  selector: 'app-finance',
  templateUrl: './finance.page.html',
  styleUrls: ['./finance.page.scss'],
})
export class FinancePage implements OnInit {
  tabs: {
    link: string,
    title: string,
    icon: string,
    selected: boolean,
    permission?: string
  }[] = [
    {
      title: 'Finance.Supplier.Title',
      link: 'supplier',
      icon: 'people-outline',
      selected: false,
    },
     {
      title: 'Finance.AType.Title',
      link: 'account-type',
      icon: 'list-circle-outline',
      selected: false,
      permission:'AccountType:READ:MANAGE,SuperAdminAccess:MANAGE,AdminAccess:MANAGE,auditorAccess:MANAGE',
    },
    {
      title: 'Finance.Item.Title',
      link: 'items',
      icon: 'file-tray-stacked-outline',
      selected: false,

    },
    {
      title: 'Finance.Expense.Title',
      link: 'expense',
      icon: 'wallet-outline',
      selected: false,
      permission:'Expense:READ:MANAGE,SuperAdminAccess:MANAGE,AdminAccess:MANAGE,AdminSupportAccess:MANAGE,auditorAccess:MANAGE'

    },
      {
        title: 'Finance.Invoice.Title',
        link: 'invoice',
        icon: 'document-text-outline',
        selected: false,

      },
      {
        title: 'Finance.Receipt.Title',
        link: 'receipt',
        icon: 'receipt-outline',
        selected: false,

      },  
    {
     
      title: 'Court.Cases.Charges',
      icon: 'cash',
      selected: false,
      link: 'charges',
      permission:'Charge:READ:MANAGE,SuperAdminAccess:MANAGE,AdminAccess:MANAGE,AdminSupportAccess:MANAGE,SLawyerAccess:MANAGE,LawyerAccess:MANAGE',
    },

      {
        title: 'Finance.TX.Title',
        link: 'tax',
        icon: 'layers-outline',
        selected: false,
        permission:'Tax:READ:MANAGE,SuperAdminAccess:MANAGE,AdminAccess:MANAGE',
      },
    /*   {
        title: 'Finance.Account_Transactions.Title',
        link: 'account-transection',
        icon: 'git-compare-outline',
        selected: false,

      },*/

      {
        title: 'Finance.NormalReports.Title',
        link: 'normal-reports',
        icon: 'newspaper-outline',
        selected: false,

      },
      {
        title: 'Finance.Reports.Title',
        link: 'reports',
        icon: 'newspaper-outline',
        selected: true,
        permission:'Finance:REPORT:MANAGE,SuperAdminAccess:MANAGE,AdminAccess:MANAGE,auditorAccess:MANAGE',
      },
     /* {
        title: 'Finance.PLBSCategory.Title',
        link: 'finance/plbs-category',
        icon: 'bookmark-outline',
        selected: false,

      },
      {
        title: 'Finance.PLBSSubCategory.Title',
        link: 'finance/plbs-sub-category',
        icon: 'bookmarks-outline',
        selected: false,

      }*/
    ]
    
    
    

    constructor(public lang: LanguageService, private router: Router, public authz: AuthzService,) { 
      /*if (!(this.authz.canDo('READ', 'Finance', []) || this.authz.canDo('MANAGE', 'Finance', []))) {
        this.router.navigateByUrl(`/login`)
      }*/
    }

    ionViewWillEnter(){
      /*if (!(this.authz.canDo('READ', 'Finance', []) || this.authz.canDo('MANAGE', 'Finance', []))) {
        this.router.navigateByUrl(`/login`)
      }*/
    }


  ngOnInit() {
    /*if (!(this.authz.canDo('READ', 'Finance', []) || this.authz.canDo('MANAGE', 'Finance', []))) {
      this.router.navigateByUrl(`/login`)
    }*/
    this.router.navigate(['/finance/account-type']);

    console.log(this.router.url);
    this.tabs = this.tabs.map(dt => {
      dt.selected = this.router.url.includes(`finance/${dt.link}`);
      return dt;
    })
  }

  selectTab(index: number) {
    this.tabs = this.tabs.map((dt, i) => {
      dt.selected = i === index;
      return dt
    });
    this.router.navigate(['finance/reports', this.tabs[index].link]);
  }
}
