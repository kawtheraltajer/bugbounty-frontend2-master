import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthzService } from 'src/app/services/authz.service';

@Component({
  selector: 'app-announcement',
  templateUrl: './announcement.page.html',
  styleUrls: ['./announcement.page.scss'],
})
export class AnnouncementPage implements OnInit {

  constructor(
    public router: Router,
    public authz: AuthzService
  ) { 
    /*if (!(this.authz.canDo('READ', 'Announcement', []) || this.authz.canDo('MANAGE', 'Announcement', []))) {
      this.router.navigateByUrl(`/login`)
    }*/
  }

  ngOnInit() {
    /*if (!(this.authz.canDo('READ', 'Announcement', []) || this.authz.canDo('MANAGE', 'Announcement', []))) {
      this.router.navigateByUrl(`/login`)
    }*/
  }

}
