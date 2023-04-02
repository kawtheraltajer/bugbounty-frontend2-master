import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonSegment } from '@ionic/angular';
import { MenuService } from 'src/app/services/menu.service';

@Component({
  selector: 'app-system',
  templateUrl: './system.page.html',
  styleUrls: ['./system.page.scss'],
})
export class SystemPage implements OnInit {
  @ViewChild('segment') segment: IonSegment;
  public selectedSegment: string = 'users';
  $routeSub;
  constructor(public menu: MenuService, private rt: Router) { }

  ngOnInit() {
    this.selectedSegment = window.location.pathname.split('/')[2];
  }
  async segmentChanged(ev: any) {
    if (ev.detail?.value) {
      this.selectedSegment = ev.detail.value;
      this.rt.navigate(['system', ev.detail.value])
      let el = document.getElementById("segment-" + this.selectedSegment);
      if (el) {
        el.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center'
        });
      }
    }
  }
}
