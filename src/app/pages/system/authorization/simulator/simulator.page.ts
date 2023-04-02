import { Component, OnInit } from '@angular/core';
import { Action, ActionEnum, Subject, SubjectEnum } from 'src/app/interfaces/types';
import { AppService } from 'src/app/services/app.service';
import { AuthzService } from 'src/app/services/authz.service';
import { LanguageService } from 'src/app/services/language.service';


@Component({
  selector: 'app-simulator',
  templateUrl: './simulator.page.html',
  styleUrls: ['./simulator.page.scss'],
})
export class SimulatorPage implements OnInit {
  selectedUser: number = 1;
  selectedAct: Action = 'CREATE';
  selectedSub: Subject = 'User';
  actions: string[] = []
  subjects: string[] = []
  constructor(public lang: LanguageService,public authz: AuthzService, public app: AppService,) { }

  async ngOnInit() {
    this.actions = this.app.enums.Action;
    this.subjects = this.app.enums.Subject;
    console.log(this.actions);
    await this.authz.getAllUsers();
  }
  async simulate() {
    await this.app.presentLoading();
    const res = await this.authz.simulate({
      action: this.selectedAct,
      subject: this.selectedSub,
      userID: this.selectedUser,
    });

    await this.app.dismissLoading();
    if (res.isAuth) {
      await this.app.presentAlert('Success!', 'The User Have the Authorization to do the Operation.', 'successAlert')
    } else {
      await this.app.presentAlert('Denied!', 'The User doest Have the Authorization to do the Operation.', 'errorAlert')
    }
  }
}
