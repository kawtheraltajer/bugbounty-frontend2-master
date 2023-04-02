
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-workforce',
  templateUrl: './workforce.page.html',
  styleUrls: ['./workforce.page.scss'],
})
export class WorkforcePage implements OnInit {

  selectedTab = 0;
  activeLink = 'leaves';
  tabs: {
    link: string,
    title: string,
    icon: string,
    selected: boolean,
  }[] = [{
    title: 'HCM.Workforce.leaves.Title',
    icon: 'apps-outline',
    selected: true,
    link: 'leaves'
  }]
  constructor(private router: Router) { }

  ngOnInit() {
    console.log(this.router.url);
    this.tabs = this.tabs.map(dt => {
      dt.selected = this.router.url.includes(`/hcm/workforce/${dt.link}`);
      return dt;
    })
  }

  selectTab(link: String) {
    this.router.navigate(['/hcm/workforce/'+link])

  }
}
