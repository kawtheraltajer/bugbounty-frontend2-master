import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ModalController, PopoverController } from '@ionic/angular';
import { TaskStatus } from 'src/app/interfaces/types';
import { AppService } from 'src/app/services/app.service';
import { AuthzService } from 'src/app/services/authz.service';
import { TaskService } from 'src/app/services/task.service';

import { LanguageService } from 'src/app/services/language.service';

@Component({
  selector: 'app-add-task-status',
  templateUrl: './add-task-status.component.html',
  styleUrls: ['./add-task-status.component.scss'],
})
export class AddTaskStatusComponent implements OnInit {
  @Input() isEdit: boolean = false;
  @Input() taskStatus: TaskStatus;
  @Input() groupID: number;
  addForm: FormGroup;
  isHidden = new FormControl(false);
  isChangesLocked = new FormControl(false);
  constructor(
    public lang: LanguageService,
    public modalCtrl: ModalController,
    public app: AppService,
    private popoverController: PopoverController,
    fb: FormBuilder,
    public authz: AuthzService,
    private taskService: TaskService) {
    this.addForm = fb.group({
      name_ar: ['', [Validators.required]],
      name_en: ['', [Validators.required]],
      color: ['#fc6f03', [Validators.required]],
    });
  }

  async ngOnInit() {
    if (this.isEdit) {
      this.addForm.setValue({
        name_ar: this.taskStatus.name_ar,
        name_en: this.taskStatus.name_en,
        color: this.taskStatus.color
      });
      this.isHidden.setValue(this.taskStatus.isHidden);
      this.isChangesLocked.setValue(this.taskStatus.isChangesLocked);
    }
  }

  async add() {
    if (this.addForm.valid && this.groupID) {
      await this.app.presentLoading();
      try {
        await this.app.dismissLoading();
        let data = this.addForm.value
        let status = this.isEdit ? await this.taskService.updateStatus({
          id: this.taskStatus.id,
          color: data.color,
          name_ar: data.name_ar,
          name_en: data.name_en,
          isChangesLocked: this.isChangesLocked.value,
          isHidden: this.isHidden.value,
        }) : await this.taskService.createStatus({
          color: data.color,
          name_ar: data.name_ar,
          name_en: data.name_en,
          isChangesLocked: this.isChangesLocked.value,
          isHidden: this.isHidden.value,
          groupID: this.groupID
        });
        this.dismiss({ isAdded: true, data: status });
      } catch (e) {
        console.log(e);
        this.dismiss({ isAdded: false, data: null });
      }
    } else {
      this.addForm.markAllAsTouched();
      await this.app.dismissLoading();
      await this.app.presentAlert('Sorry ~', 'Please Fill the required fields with valid values.', 'errorAlert');
    }
  }

  dismiss(data: { isAdded: boolean, data?: TaskStatus }) {
    this.modalCtrl.dismiss({
      'dismissed': true,
      data
    });
  }

  async choseColor(ev) {
    let color = await this.app.selectColor(this.popoverController, ev);
    this.addForm.get('color').setValue(color)
  }
}