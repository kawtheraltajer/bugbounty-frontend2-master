import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Role } from 'src/app/interfaces/types';
import { AuthzService } from 'src/app/services/authz.service';

@Component({
  selector: 'app-link-modal',
  templateUrl: './link-modal.component.html',
  styleUrls: ['./link-modal.component.scss'],
})
export class LinkModalComponent implements OnInit {
  @Input('role') role: Role;
  type: 'permissionToRole' | 'roleToGroup' | 'roleToUser' = 'permissionToRole';
  toID: number

  constructor(public authz: AuthzService, private modalController: ModalController) { }

  ngOnInit() { }

  async link() {
    let res = await this.authz.link({
      type: this.type,
      roleID: this.role.id,
      permissionID: this.toID,
      userID: this.toID,
      groupID: this.toID
    });
  }

  async dismiss() {
    await this.modalController.dismiss();
  }
}
