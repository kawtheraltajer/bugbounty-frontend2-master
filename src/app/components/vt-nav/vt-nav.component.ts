import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'vt-nav',
  templateUrl: './vt-nav.component.html',
  styleUrls: ['./vt-nav.component.scss'],
})
export class VtNavComponent implements OnInit {
  @Input() tabs: {
    link: string,
    title: string,
    icon: string,
    selected: boolean,
    permission?: string;
  }[]

  @Input() routePrefix: string = '';
  @Input() applyTranslate: boolean = true;
  constructor(private router: Router) { }

  ngOnInit() {
    // console.log(this.router.url);
    this.tabs = this.tabs.map(dt => {
      dt.selected = this.router.url.includes(`${this.routePrefix}/${dt.link}`);
      return dt;
    })
  }

  selectTab(index: number) {
    this.tabs = this.tabs.map((dt, i) => {
      dt.selected = i === index;
      return dt
    });
    this.router.navigate([this.routePrefix, this.tabs[index].link]);
  }

}
