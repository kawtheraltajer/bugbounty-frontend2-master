import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-charges',
  templateUrl: './charges.page.html',
  styleUrls: ['./charges.page.scss'],
})
export class ChargesPage implements OnInit {
  isLoading = true;
  constructor() { }

  ngOnInit() {
    this.isLoading = false;

  }

}
