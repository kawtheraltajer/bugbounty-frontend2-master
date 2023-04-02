

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-leaves',
  templateUrl: './leaves.page.html',
  styleUrls: ['./leaves.page.scss'],
})
export class LeavesPage implements OnInit {

  selectedTab = 0;
  activeLink = 'dashbourd';
  tabs: {
    link: string,
    title: string,
    icon: string,
    selected: boolean,
  }[] = [{
    title: 'HCM.Workforce.leaves.Dashbourd',
    icon: 'apps-outline',
    selected: true,
    link: 'dashbourd'
  },
  
  {
    title: 'HCM.Workforce.leaves.leave_Types.Title',
    icon: 'bookmarks-outline',
    selected: false,
    link: 'leave-types'
  ,
},
{

  title: 'HCM.Workforce.leaves.holiday.Title',
  icon: 'paper-plane',
  selected: false,
  link: 'holiday'
,
},
{

  title: 'HCM.Workforce.leaves.balance.Title',
  icon: 'time',
  selected: false,
  link: 'balance'
,
},

]

  constructor(private router: Router) {

    this.selectedTab=0;


   }

  ngOnInit() {
    this.router.navigate(['hcm/workforce/leaves/dashbourd']);
    this.selectTab(0) 
  this.selectedTab=0;
    console.log(this.tabs)
    console.log(this.router.url);
    this.tabs = this.tabs.map(dt => {
      dt.selected = this.router.url.includes(`hcm/workforce/leaves/${dt.link}`);
      return dt;
    })
  }

  selectTab(index: number) {

    this.tabs = this.tabs.map((dt, i) => {
      dt.selected = i === index;
      return dt
    });
    this.router.navigate(['hcm/workforce/leaves/', this.tabs[index].link]);
  }

  dismiss(){
    this.router.navigate(['hcm/workforce']);
  }
}
