import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { LanguageService } from 'src/app/services/language.service';
import { filter, pairwise } from 'rxjs/operators';


@Component({
  selector: 'app-court',
  templateUrl: './court.page.html',
  styleUrls: ['./court.page.scss'],
})

export class CourtPage implements OnInit {
  tabs: {
    link: string,
    title: string,
    icon: string,
    selected: boolean,
    permission?: string
    subject?: string,
    action?: string,
  }[] = [/*{
      title: 'Dashboard.NotMain',
      icon: 'apps-outline',
      selected: true,
      link: 'dashboard'
    },*/
    {
      title: 'Court.agenda.Title',
      icon: 'newspaper-outline',
      selected: true,
      link: 'agenda',
     permission:'Court:READ:MANAGE,SuperAdminAccess:MANAGE,AdminAccess:MANAGE,AdminSupportAccess:MANAGE,SLawyerAccess:MANAGE,LawyerAccess:MANAGE'
    },
    {
      title: 'Court.clients.Title',
      icon: 'people-outline',
      selected: false,
      link: 'clients',
      permission:'Client:READ:MANAGE,SuperAdminAccess:MANAGE,AdminAccess:MANAGE,AdminSupportAccess:MANAGE,SLawyerAccess:MANAGE,LawyerAccess:MANAGE',
    },
    {
      title: 'Court.Cases.Title',
      icon: 'briefcase',
      selected: false,
      link: 'cases-list',
      permission:'Case:READ:MANAGE,SuperAdminAccess:MANAGE,AdminAccess:MANAGE,AdminSupportAccess:MANAGE,SLawyerAccess:MANAGE,LawyerAccess:MANAGE',
    },  
    {
      title: 'Court.Session.Title',
      icon: 'calendar-outline',
      selected: false,
      link: 'session',
      permission:'Session:READ:MANAGE,SuperAdminAccess:MANAGE,AdminAccess:MANAGE,AdminSupportAccess:MANAGE,SLawyerAccess:MANAGE,LawyerAccess:MANAGE',

    },
    {
      title: 'Court.Companies.Title',
      icon: 'business-outline',
      selected: false,
      link: 'companies',
      permission:'Company:READ:MANAGE,SuperAdminAccess:MANAGE,AdminAccess:MANAGE,AdminSupportAccess:MANAGE,SLawyerAccess:MANAGE,LawyerAccess:MANAGE',

      
    },
    {
      title: 'Court.Cases.Case-type.Title',
      icon: 'bookmarks-outline',
      selected: false,
      link: 'case-types',
      permission:'CaseType:READ:MANAGE,SuperAdminAccess:MANAGE,AdminAccess:MANAGE,AdminSupportAccess:MANAGE,SLawyerAccess:MANAGE',

    },
    {
      title: 'Court.Cases.delay-reson.Title',
      icon: 'arrow-redo-outline',
      selected: false,
      link: 'delay-reason',
      permission:'DelayReson:READ:MANAGE,SuperAdminAccess:MANAGE,AdminAccess:MANAGE,AdminSupportAccess:MANAGE,SLawyerAccess:MANAGE',

    },
    {
      title: 'Court.Cases.requests.Title',
      icon: 'hand-left-outline',
      selected: false,
      link: 'requests',
      permission:'Request:READ:MANAGE,SuperAdminAccess:MANAGE,AdminAccess:MANAGE,AdminSupportAccess:MANAGE,SLawyerAccess:MANAGE,LawyerAccess:MANAGE',
   
      
    },
    {
      title: 'Court.Cases.ChargeType.Title',
      icon: 'cash',
      selected: false,
      link: 'charge-type',
      permission:'ChargeType:READ:MANAGE,SuperAdminAccess:MANAGE,AdminAccess:MANAGE,AdminSupportAccess:MANAGE',
    },
    {
      title: 'المحاكم',
      icon: 'cash',
      selected: false,
      link: 'court-list',
      permission:'ChargeType:READ:MANAGE,SuperAdminAccess:MANAGE,AdminAccess:MANAGE,AdminSupportAccess:MANAGE',
    },
    {
      title: 'Court.Reports.Title',
      icon: 'pie-chart-outline',
      selected: false,
      link: 'reports',
      permission:'Court:REPORT:MANAGE,SuperAdminAccess:MANAGE,AdminAccess:MANAGE,AdminSupportAccess:MANAGE,SLawyerAccess:MANAGE,LawyerAccess:MANAGE',
    },
  ]
  constructor( public lang: LanguageService,private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {

    //this.router.navigate(['court/agenda']);
  }

  selectTab(index: number) {
    this.tabs = this.tabs.map((dt, i) => {
      dt.selected = i === index;
      return dt
    });
    this.router.navigate(['court', this.tabs[index].link]);
  }

}
