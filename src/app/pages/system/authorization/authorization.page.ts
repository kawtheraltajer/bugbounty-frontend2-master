import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonSegment } from '@ionic/angular';

import { SubjectEnum, ActionEnum, Subject, Action } from 'src/app/interfaces/types';
import { AppService } from 'src/app/services/app.service';
import { AuthzService } from 'src/app/services/authz.service';
import { MenuService } from 'src/app/services/menu.service';

@Component({
  selector: 'app-authorization',
  templateUrl: './authorization.page.html',
  styleUrls: ['./authorization.page.scss'],
})
export class AuthorizationPage implements OnInit, OnDestroy {
  @ViewChild('segment') segment: IonSegment;
  public selectedSegment: string = 'users';
  constructor(public authz: AuthzService, private rt: Router, public app: AppService, public menu: MenuService) { }

  async ngOnInit() {
   this.authz.getAll();
    this.selectedSegment = window.location.pathname.split('/')[3];
  }


  async segmentChanged(ev: any) {
    if (ev.detail.value) {
      this.rt.navigate(['system', 'authorization', ev.detail.value]);
      this.selectedSegment = ev.detail.value;
      let el = document.getElementById("segment-" + ev.detail.value);
      if (el) {
        el.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center'
        });
      }
    }
  }
  ngOnDestroy() {
  }
}
