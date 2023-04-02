import { SelectionModel } from '@angular/cdk/collections';
import { Employee, } from 'src/app/interfaces/types';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AfterViewInit, ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';

import { ModalController } from '@ionic/angular';
import { Permission, Role, User, Education } from 'src/app/interfaces/types';
import { AppService } from 'src/app/services/app.service';
import { AuthzService } from 'src/app/services/authz.service';
import { LanguageService } from 'src/app/services/language.service';
import { environment } from 'src/environments/environment';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'education-list',
  templateUrl: './education-list.component.html',
  styleUrls: ['./education-list.component.scss'],
})
export class EducationListComponent implements OnInit {

  @Input('isEdit') isEdit: boolean;
  @Input('educations') educations: Education[];
  @Input('employeeID') employeeID: number
  @Input('isAdd') isAdd: boolean = false;
  educationColumns: string[];
  @Input('selectededucation') selectedcertificate: Education[];
  educationList = new MatTableDataSource([]);
  @Input('showSelected') showSelected: boolean;
  selection = new SelectionModel<Employee>(true, []);
  @ViewChild('EducationTablePaginator', { static: true }) tablePaginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  isSearch = false;
  searchTerm = '';
  data: any;
  constructor(public lang: LanguageService, public modalController: ModalController, public app: AppService, public authz: AuthzService) {
  }
  async ngOnInit() {

    this.data = await this.authz.getEmployee(this.employeeID);
    this.educations = this.data.education

    if (this.isEdit) {
      this.educationColumns = ['id', 'place', 'result', 'duration', 'type', 'Action', "Decument"];

    } else if (!this.isEdit) {
      this.educationColumns = ['id', 'place', 'result', 'duration', 'type', "Decument"];

    }
    this.getDisplayedColumns();
    this.educationList = new MatTableDataSource(this.educations);
    this.educationList.paginator = this.tablePaginator;
    if (this.selectedcertificate && this.showSelected) {
      let selectedIds = this.selectedcertificate.map(dt => dt.id);

    }

  }
  dawnloadUrl(Decument) {

  }
  async download(Decument) {


    if (Decument != '' && Decument != 'null') {
      saveAs(`${environment.storageURL}/public/uploads/document/${Decument}`, Decument);

    } else {
      await this.app.presentAlert('Sorry ~', 'There is no file to dawnload it ', 'errorAlert');

    }
  }

  async activate(id, ev) {
    console.log(id);
    console.log(ev);

  }


  async add() {
    const modal = await this.modalController.create({ component: AddEducationModal, cssClass: 'responsiveModal', componentProps: { employeeID: Number(this.employeeID) } });
    modal.onWillDismiss().then(data => {
      this.ngOnInit()
    });
    return await modal.present();
  }

  async deleteEducation(row) {
    let confirm = await this.app.presentConfirmAlert("Confirm Delete", "Are you sure you want to delete Education ?", "Operations.Cancel", "Operations.Confirm", true)
    if (confirm) {
      this.authz.deleteEducation(row.id)
      this.ngOnInit()
    }
  }

  async update(row) {
    const modal = await this.modalController.create({ component: UpdateEducationModal, cssClass: 'responsiveModal', componentProps: { Education: row } });

    modal.onWillDismiss().then(data => {
      this.ngOnInit()
    });
    return await modal.present();
  }

  applyFilter() {
    this.educationList.filter = this.searchTerm.trim().toLowerCase();
  }

  getDisplayedColumns(): string[] {
    return this.educationColumns;
  }

}


@Component({
  selector: 'add-education',
  templateUrl: './add-education.html',
})

export class AddEducationModal implements OnInit {

  @Input('employeeID') employeeID: number
  @Input('Educationid') Educationid: number
  validation_messages: any;
  isLoading = true;
  addForm: FormGroup;
  constructor(public modalCtrl: ModalController, private app: AppService, fb: FormBuilder, public authz: AuthzService) {

    this.addForm = fb.group({
      employeeID: [,],
      place: ['', [Validators.required]],
      result: ['',],
      duration: ['',],
      type: ['', [Validators.required]],
      documentURL: ['',]

    });
  } async ngOnInit() {

    this.validation_messages = {
      'place': [
        { type: 'required', message: 'Employee_managment.Employee-talents.Education.massages.place.required' },
      ],
      'type': [
        { type: 'required', message: 'Employee_managment.Employee-talents.Education.massages.type.required' },
      ],
      'documentURL': [
        { type: 'required', message: 'Employee_managment.Employee-talents.Education.massages.documentURL.required' },

      ]

    }
    this.addForm.setValue({
      employeeID: this.employeeID,
      place: "",
      result: "",
      duration: "",
      type: "",
      documentURL: ""

    })
  }



  async add() {
    if (this.addForm.valid) {
      await this.app.presentLoading();
      let { documentURL, ...data } = this.addForm.value;
      let url = '';
      try {
        if (documentURL) {
          let doc = documentURL.files[0];
          let uploaded;
          if (doc) {
            uploaded = await this.authz.uploadFile(doc);
            if (uploaded?.file.filename) {
              url = uploaded?.file.filename;
            }
          }
        }

        await this.addForm.setValue({
          employeeID: this.employeeID,
          place: data.place,
          result: data.result,
          duration: data.duration,
          type: data.type,
          documentURL: url

        })
        let forming = this.addForm.value
        let user = await this.authz.AddEducation(forming)
        await this.app.dismissLoading();
        this.dismiss();
      } catch (e) {
        console.log(e);
      }
    } else {
      this.addForm.markAllAsTouched();
      await this.app.dismissLoading();
    }
  }



  dismiss() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }
}


@Component({
  selector: 'update-education',
  templateUrl: './update-education.html',
})

export class UpdateEducationModal implements OnInit {
  @Input('employeeID') employeeID: number;
  @Input('Educationid') Educationid: number;
  @Input('Education') Education: Education;
  validation_messages: any

  isLoading = true;
  updateForm: FormGroup;
  constructor(public modalCtrl: ModalController, private app: AppService, fb: FormBuilder, public authz: AuthzService) {

    this.updateForm = fb.group({
      EducationID: [,],
      employeeID: [,],
      place: ['', [Validators.required]],
      result: ['',],
      duration: ['',],
      type: ['', [Validators.required]],
      documentURL: ['',]

    });
  }

  async Delete() {
    let confirm = await this.app.presentConfirmAlert("Operations.Confirm", "Employee_managment.Employee-talents.Education.Errors.confirm_delete", "Operations.Cancel", "Operations.Confirm", true)
    if (confirm) {
      this.authz.deleteEducation(this.Education.id)
      this.dismiss()
      this.ngOnInit()
    }
  }

  async ngOnInit() {

    this.validation_messages = {
      'place': [
        { type: 'required', message: 'Employee_managment.Employee-talents.Education.massages.place.required' },
      ],
      'type': [
        { type: 'required', message: 'Employee_managment.Employee-talents.Education.massages.type.required' },
      ],
      'documentURL': [
        { type: 'required', message: 'Employee_managment.Employee-talents.Education.massages.documentURL.required' },

      ]

    }

    this.updateForm.setValue({
      EducationID: this.Education.id,
      employeeID: this.Education.employeeID,
      place: this.Education.place,
      result: this.Education.result,
      duration: this.Education.duration,
      type: this.Education.type,
      documentURL: this.Education.place
    })


  }
  async update() {
    await this.app.presentLoading();
    if (this.updateForm.valid) {
      let data = this.updateForm.value;
      try {
        await this.authz.UpdateEducation(data);
        await this.app.dismissLoading();
        this.dismiss();
      } catch (e) {
        console.log(e);
      }
    } else {
      this.updateForm.markAllAsTouched();
      await this.app.dismissLoading();
    }
  }

  dismiss() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }
}



