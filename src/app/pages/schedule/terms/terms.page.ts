import { PayrollGroup } from './../../../interfaces/types';
import { Router } from '@angular/router';
import { MenuService } from './../../../services/menu.service';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
@Component({
  selector: 'app-terms',
  templateUrl: './terms.page.html',
  styleUrls: ['./terms.page.scss'],
})
export class TermsPage implements OnInit {
  dontshow:boolean=true
  constructor(    private router:Router,
    public menu: MenuService,public modalCtrl: ModalController,) {

    this.menu.disableMainMenu();
   }

  ngOnInit() {
    if (this.router.url == '/terms') {
      this.menu.disableMainMenu();
    }

  }

  dismiss() {
    this.modalCtrl.dismiss({
      'dismissed': true,

    });
  }
  }

