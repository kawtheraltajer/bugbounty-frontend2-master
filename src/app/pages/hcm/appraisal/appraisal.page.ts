import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthzService } from 'src/app/services/authz.service';

@Component({
  selector: 'app-appraisal',
  templateUrl: './appraisal.page.html',
  styleUrls: ['./appraisal.page.scss'],
})
export class AppraisalPage implements OnInit {
  tabs: {
    link: string,
    title: string,
    icon: string,
    selected: boolean,
    permission?: string
  }[] = [
   /* {
    title: 'Dashboard.NotMain',
    icon: 'apps-outline',
    selected: true,
    link: 'dashboard'
  },*/ {
    title: 'HCM.Appraisal.Plural',
    icon: 'documents-outline',
    selected: true,
    link: 'list'
  }, {
    title: 'HCM.Appraisal.Template',
    icon: 'rocket-outline',
    selected: false,
    link: 'templates'
  }, {
    title: 'Type.Plural',
    icon: 'bookmarks-outline',
    selected: false,
    link: 'types',
  },
    ]
  constructor(private router: Router, public authz: AuthzService) { }

  ngOnInit() {
    console.log(this.router.url);
    this.tabs = this.tabs.map(dt => {
      dt.selected = this.router.url.includes(`/hcm/appraisal/${dt.link}`);
      return dt;
    })
  }

  selectTab(index: number) {
    this.tabs = this.tabs.map((dt, i) => {
      dt.selected = i === index;
      return dt
    });
    this.router.navigate(['hcm/appraisal', this.tabs[index].link]);
  }
}
