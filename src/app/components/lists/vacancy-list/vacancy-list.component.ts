import { environment } from './../../../../environments/environment.prod';
import { MatDrawer } from '@angular/material/sidenav';
import { EditorComponent } from '@tinymce/tinymce-angular';
import { ActivatedRoute, Router } from '@angular/router';
import { state } from '@angular/animations';
import { data } from 'autoprefixer';
import { Component, OnInit, ElementRef } from '@angular/core';
import { Contact, Department, VacancyApplication, VacancyType } from './../../../interfaces/types';
import { AfterViewInit, ChangeDetectionStrategy, Input, OnChanges, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { AppService } from 'src/app/services/app.service';
import { AuthzService } from 'src/app/services/authz.service';
import { Vacancy } from 'src/app/interfaces/types';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { UserService } from 'src/app/services/user.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { MatDatepicker } from '@angular/material/datepicker';
import { LanguageService } from 'src/app/services/language.service';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'vacancy-list',
  templateUrl: './vacancy-list.component.html',
  styleUrls: ['./vacancy-list.component.scss'],
})
export class VacancyListComponent implements OnInit {
  Vacancy: Vacancy[];
  @Input('isAdd') isAdd: boolean = false;
  VacancyColumns: string[];
  @Input('selectedVacancy') selectedVacancy: Vacancy[];
  vacancyList = new MatTableDataSource([]);
  @Input('showSelected') showSelected: boolean;
  selection = new SelectionModel<Vacancy>(true, []);
  @ViewChild('VacancyTablePaginator', { static: true }) tablePaginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  isSearch = false;
  searchTerm = '';
  status: string;
  constructor(public modalController: ModalController, public app: AppService, public authz: AuthzService, private router: Router,) { }
  async ngOnInit() {
    this.VacancyColumns = ['id', 'position', 'location', 'type', 'state', 'Action'];
    this.getDisplayedColumns();
    this.Vacancy = await this.authz.getAllVacancy()
    this.vacancyList = new MatTableDataSource(this.Vacancy);
    this.vacancyList.paginator = this.tablePaginator;
    if (this.selectedVacancy && this.showSelected) {
      let selectedIds = this.selectedVacancy.map(dt => dt.id);
      this.selection = new SelectionModel<Vacancy>(true, [
        ...this.vacancyList.data.filter(row => selectedIds.includes(row.id))
      ]);
    }
  }

  async ngOnChanges() {
    this.Vacancy = await this.authz.getAllVacancy()
    this.vacancyList.data = this.Vacancy
  }

  ngAfterViewInit() {
    this.vacancyList = new MatTableDataSource(this.Vacancy);
    this.vacancyList.paginator = this.tablePaginator;
    this.vacancyList.sort = this.sort;
  }
  async activate(id, ev) {
    console.log(id);
    console.log(ev);
  }
  async add() {
    const modal = await this.modalController.create({ component: AddVacancyModal, cssClass: 'responsiveModal' });
    modal.onWillDismiss().then(data => {
      this.ngOnInit()
    });
    return await modal.present();
  }


  async details(row) {
    this.router.navigate(['hcm/recruitment/vacancyDetails', row.id])

  }

  async UpdateVacancystatus(id, status) {
    this.authz.UpdateVacancystatus(id, status)
    //to refresh pages and view the update 
    this.ngOnInit()
  }

  applyFilter() {
    this.vacancyList.filter = this.searchTerm.trim().toLowerCase();
  }

  getDisplayedColumns(): string[] {
    return this.app.isDesktop ? this.VacancyColumns : this.VacancyColumns;
  }
  async deleterow(row) {
    let confirm = await this.app.presentConfirmAlert("Operations.Confirm", "Vacancy.Errors.confirm_delete", "Operations.Cancel", "Operations.Confirm", true)
    if (confirm) {
      this.authz.deleteVacancy(row.id)
      this.ngOnInit()

    }
  }


}

@Component({
  selector: 'add-vacancy',
  templateUrl: './add-vacancy.html',
})
export class AddVacancyModal implements OnInit {
  isLoading = true;
  AddTags: boolean
  addressForm: FormGroup;
  segment: number;
  addForm: FormGroup;
  departments: Department[];
  tagsList: [];
  public openingAt: string = new Date().toISOString();
  isEditMode = false;
  isHidden = true;
  newComment = '';
  editorData;
  previewData = ``;
  showComments = false;
  showCommentsHandle = true;
  sideHasBackdrop = true;
  description: string
  validation_messages: any;
  sideMode: 'over' | 'push' | 'side' = 'over';
  onSave = () => {
    console.log('save');
  }
  @ViewChild('editorcomp') editorcomp: EditorComponent;
  @ViewChild('drawer') drawer: MatDrawer;
  @ViewChild('previewComp') previewComp: EditorComponent;
  @ViewChild('#editorDiv') editorDiv: ElementRef;
  @ViewChild('#headerDiv') headerDiv: ElementRef;
  editorConfig = {
    height: '100%',
    menubar: false,
    readonly: true,
    language: 'en',
    directionality: 'rtl',
    resize: false,
    branding: false,
    save_enablewhendirty: true,
    plugins: [
      'advlist autolink lists link image charmap print preview anchor',
      'searchreplace visualblocks code fullscreen',
      'insertdatetime media table paste code help wordcount'
    ],
    save_onsavecallback: this.onSave,
    toolbar:
      'undo redo | formatselect | bold italic forecolor backcolor   | \
      alignleft aligncenter alignright alignjustify | \
      bullist numlist outdent indent | removeformat | help'
  };
  previewConfig = {
    readonly: true,
    mode: "readonly",
    menubar: false,
    toolbar: false,
    plugins: ['autoresize'],
    statusbar: false,
    branding: false,
    autoresize_bottom_margin: 20,
    directionality: 'rtl',
  }
  constructor(public modalCtrl: ModalController, private app: AppService, fb: FormBuilder, public authz: AuthzService, public lang: LanguageService,
  ) {
    this.addForm = fb.group({
      number_of_openings: ['', [Validators.required, Validators.pattern('[0-9]+')]],
      code: [,],
      coverURL: ['',],
      tags: ['',],
      description: ['',],
      departmentID: ['', [Validators.required]],
      position: ['', [Validators.compose([Validators.maxLength(25), Validators.required])]],
      location: ['', [Validators.compose([Validators.maxLength(25), Validators.required])]],
      type: ['', [Validators.required]],
      status: ['', [Validators.required]],
      openingAt: ['', [Validators.required]],
      closingAt: ['', [Validators.required]],
      createdAt: ['',],
      education_level: ['', [Validators.required]],

    });

  }
  async ngOnInit() {
    this.description = " "
    this.validation_messages = {
      'number_of_openings': [
        { type: 'required', message: 'Vacancy.massages.number_of_openings.required' },
        { type: 'pattern', message: 'Vacancy.massages.number_of_openings.pattern' },
      ],
      'position': [
        { type: 'required', message: 'Vacancy.massages.position.required' },
        { type: 'minlength', message: 'Vacancy.massages.position.min' },
        { type: 'maxlength', message: 'Vacancy.massages.position.max' },
      ],
      'location': [
        { type: 'required', message: 'Vacancy.massages.location.required' },
        { type: 'minlength', message: 'Vacancy.massages.location.min' },
        { type: 'maxlength', message: 'Vacancy.massages.location.max' },

      ],
      'type': [
        { type: 'required', message: 'Vacancy.massages.type.required' },
      ],
      'status': [
        { type: 'required', message: 'Vacancy.massages.status.required' },
      ],
      'openingAt': [
        { type: 'required', message: 'Vacancy.massages.openingAt.required' },
        { type: 'date', message: 'Vacancy.massages.date.required' },

      ],
      'closingAt': [
        { type: 'required', message: 'Vacancy.massages.closingAt.required' },
        { type: 'date', message: 'Vacancy.massages.closingAt.required' },],
      'education_level': [
        { type: 'required', message: 'Vacancy.massages.education_level.required' },
        { type: 'minlength', message: 'Vacancy.massages.education_level.min' },
        { type: 'maxlength', message: 'Vacancy.massages.education_level.max' },],
    }

    this.departments = await this.authz.getAllDepartment()
    
    this.addForm.setValue({
      number_of_openings: "",
      code: "",
      coverURL: "",
      tags: "",
      description: " ",
      position: "",
      location: "",
      type: "",
      status: "",
      openingAt: "",
      closingAt: "",
      createdAt: "",
      education_level: "",
      departmentID: ""
    })




  }


  async add() {
    if (this.addForm.valid) {
      await this.app.presentLoading();

      let data = this.addForm.value
      try {
        await this.addForm.setValue({
          number_of_openings: data.number_of_openings,
          code: data.code,
          coverURL: "",
          tags: data.tags,
          description: this.description,
          position: data.position,
          location: data.location,
          type: data.type,
          status: data.status,
          openingAt: data.openingAt,
          closingAt: data.closingAt,
          createdAt: this.openingAt,
          education_level: data.education_level,
          departmentID: data.departmentID
        })
        let forming = this.addForm.value
        await this.authz.AddVacancy(forming)
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

  async step0() {
    this.segment = 0
  }
  async step1() {
    this.segment = 1
  }
  async step2() {
    this.segment = 2
  }
  async step3() {
    this.segment = 3
  }

  dismiss() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }
}





@Component({
  selector: 'vacancy-details',
  templateUrl: './vacancy-details.html',
})
export class VacancyDetailsModal implements OnInit {
  Vacancy: Vacancy;
  id: number;
  addForm: FormGroup;
  Description: any
  @Input('isAdd') isAdd: boolean = false;
  VacancyColumns: string[];
  @Input('selectedApplication') selectedApplication: VacancyApplication[];
  ApplicationList = new MatTableDataSource([]);
  @Input('showSelected') showSelected: boolean;
  selection = new SelectionModel<VacancyApplication>(true, []);
  @ViewChild('ApplicationTablePaginator', { static: true }) tablePaginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  isSearch = false;
  searchTerm = '';
  isEditMode = false;
  isHidden = true;
  newComment = '';
  editorData;
  previewData = ``;
  showComments = false;
  showCommentsHandle = true;
  sideHasBackdrop = true;
  sideMode: 'over' | 'push' | 'side' = 'over';
  onSave = () => {
    console.log('save');
  }
  @ViewChild('editorcomp') editorcomp: EditorComponent;
  @ViewChild('drawer') drawer: MatDrawer;
  @ViewChild('previewComp') previewComp: EditorComponent;
  @ViewChild('#editorDiv') editorDiv: ElementRef;
  @ViewChild('#headerDiv') headerDiv: ElementRef;
  editorConfig = {
    height: '100%',
    menubar: false,
    readonly: true,
    language: 'en',
    directionality: 'rtl',
    resize: false,
    branding: false,
    save_enablewhendirty: true,
    plugins: [
      'advlist autolink lists link image charmap print preview anchor',
      'searchreplace visualblocks code fullscreen',
      'insertdatetime media table paste code help wordcount'
    ],
    save_onsavecallback: this.onSave,
    toolbar:
      'undo redo | formatselect | bold italic forecolor backcolor   | \
      alignleft aligncenter alignright alignjustify | \
      bullist numlist outdent indent | removeformat | help'
  };
  previewConfig = {
    readonly: true,
    mode: "readonly",
    menubar: false,
    toolbar: false,
    plugins: ['autoresize'],
    statusbar: false,
    branding: false,
    autoresize_bottom_margin: 20,
    directionality: 'rtl',
  };
  fileTransfer: FileTransferObject = this.transfer.create()
  constructor(public file: File, private transfer: FileTransfer, private fb: FormBuilder, private router: Router, public modalCtrl: ModalController, public modalController: ModalController, private route: ActivatedRoute, public app: AppService, public authz: AuthzService, public lang: LanguageService,
  ) {

  }
  async ngOnInit() {

    this.addForm = this.fb.group({
      status: [,],
      applicant_first_name: ['', [Validators.compose([Validators.maxLength(25), Validators.minLength(3), Validators.required])]],
      applicant_last_name: ['', [Validators.compose([Validators.maxLength(25), Validators.minLength(3), Validators.required])]],
      //applicant_phone: ['', [Validators.compose([Validators.maxLength(11), Validators.minLength(8), Validators.pattern('[0-9]+'), Validators.required])]],
      applicant_phone: ['', [Validators.required]],
      applicant_email: ['', [Validators.compose([Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}'), Validators.required])]],
      documentURL: ['', []],
      highest_qualification: ['', [Validators.required]],
      isCurrentlyEmployed: ['',],
      recent_job_role: ['',],
      applicant_summry: ['',],
      comments: ['',],
      vacancyID: ['',],


    });
    this.id = this.route.snapshot.params.id;
    this.Vacancy = await this.authz.getVacancy(this.id);
    this.Description = this.Vacancy.description
    this.VacancyColumns = ['id', 'applicant_name', 'applicant_email', 'applicant_phone', 'status', 'Action'];
    this.getDisplayedColumns();
    this.ApplicationList = new MatTableDataSource(this.Vacancy.applications);
    this.ApplicationList.paginator = this.tablePaginator;
    if (this.selectedApplication && this.showSelected) {
      let selectedIds = this.selectedApplication.map(dt => dt.id);
      this.selection = new SelectionModel<VacancyApplication>(true, [
        ...this.ApplicationList.data.filter(row => selectedIds.includes(row.id))
      ]);
    }
  }

  async ngOnChanges() {
    this.id = this.route.snapshot.params.id;
    this.Vacancy = await this.authz.getVacancy(this.id);
    this.Description = this.Vacancy.description
    this.ApplicationList.data = this.Vacancy.applications
  }

  async ngAfterViewInit() {
    this.id = this.route.snapshot.params.id;
    this.Vacancy = await this.authz.getVacancy(this.id);
    this.Description = this.Vacancy.description
    this.ApplicationList = new MatTableDataSource(this.Vacancy.applications);
    this.ApplicationList.paginator = this.tablePaginator;
    this.ApplicationList.sort = this.sort;
  }

  async activate(id, ev) {
    console.log(id);
    console.log(ev);

  }

  async add() {
    const modal = await this.modalController.create({ component: AddApplicationsModal, cssClass: 'responsiveModal', componentProps: { vacancyID: this.Vacancy.id } });
    modal.onWillDismiss().then(data => {
      this.ngOnChanges();
    });
    return await modal.present();
  }

  async details(row) {
    const modal = await this.modalController.create({ component: ApplicationDetailsModal, cssClass: 'responsiveModal', componentProps: { vacancyApplication: row } });
    modal.onWillDismiss().then(data => {
      this.ngOnChanges();
    });
    return await modal.present();
  }

  async update() {
    const modal = await this.modalController.create({ component: UpdateVacancyModal, cssClass: 'responsiveModal', componentProps: { Vacancy: this.Vacancy } });
    modal.onWillDismiss().then(data => {
      this.ngOnChanges();
    });
    return await modal.present();

  }
  applyFilter() {
    this.ApplicationList.filter = this.searchTerm.trim().toLowerCase();
  }

  getDisplayedColumns(): string[] {
    return this.app.isDesktop ? this.VacancyColumns : this.VacancyColumns;
  }
  async delete(row) {
    let confirm = await this.app.presentConfirmAlert("Confirm Delete", "Are you sure you want to delete vacancy ?", "Operations.Cancel", "Operations.Confirm", true)
    if (confirm) {
      this.authz.deleteVacancy(row.id)

    }
  }


  async UpdateApplicationstatus(application, status) {
    this.addForm.setValue({
      id: application.id,
      status: status,
      applicant_first_name: application.applicant_first_name,
      applicant_last_name: application.applicant_last_name,
      documentURL: application.documentURL,
      applicant_phone: application.applicant_phone,
      applicant_email: application.applicant_email,
      highest_qualification: application.highest_qualification,
      recent_job_role: application.recent_job_role,
      isCurrentlyEmployed: application.isCurrentlyEmployed,
      applicant_summry: application.applicant_summry,
      comments: application.comments,
      vacancyID: application.vacancyID

    })
    if (this.addForm.valid) {
      let data = this.addForm.value;
      try {
        await this.authz.UpdateVacancyApplication(data);
        await this.app.dismissLoading();
        this.ngAfterViewInit()
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
    this.router.navigate(['hcm/recruitment'])

  }
}




@Component({
  selector: 'add-applications',
  templateUrl: './add-applications.html',
})
export class AddApplicationsModal implements OnInit {
  isLoading = true;
  addressForm: FormGroup;
  segment: number;
  addForm: FormGroup;
  @Input('vacancyID') vacancyID: number;
  isCurrentlyEmployed: boolean
  validation_messages: any;
  constructor(public modalCtrl: ModalController, private app: AppService, fb: FormBuilder, public authz: AuthzService) {


    this.addForm = fb.group({
      status: [,],
      applicant_first_name: ['', [Validators.compose([Validators.maxLength(25), Validators.minLength(3), Validators.required])]],
      applicant_last_name: ['', [Validators.compose([Validators.maxLength(25), Validators.minLength(3), Validators.required])]],
      //applicant_phone: ['', [Validators.compose([Validators.maxLength(11), Validators.minLength(8), Validators.pattern('[0-9]+'), Validators.required])]],
      applicant_phone: ['', [Validators.required]],
      applicant_email: ['', [Validators.compose([Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}'), Validators.required])]],
      documentURL: ['', [Validators.required]],
      highest_qualification: ['', [Validators.required]],
      isCurrentlyEmployed: ['',],
      recent_job_role: ['',],
      applicant_summry: ['',],
      comments: ['',],
      vacancyID: ['',],


    });

  }
  async ngOnInit() {
    this.isCurrentlyEmployed = false
    this.addForm.setValue({
      status: "Applied",
      applicant_first_name: "",
      applicant_last_name: "",
      documentURL: "",
      applicant_phone: "",
      applicant_email: "",
      highest_qualification: "",
      recent_job_role: "",
      isCurrentlyEmployed: false,
      applicant_summry: "",
      comments: " ",
      vacancyID: this.vacancyID,
    })

    this.validation_messages = {
      'applicant_first_name': [
        { type: 'required', message: 'Vacancy.massages.applicant_first_name.required' },
        { type: 'minlength', message: 'Vacancy.massages.applicant_first_name.min' },
        { type: 'maxlength', message: 'Vacancy.massages.applicant_first_name.max' },
      ],
      'applicant_last_name': [
        { type: 'required', message: 'Vacancy.massages.applicant_last_name.required' },
        { type: 'minlength', message: 'Vacancy.massages.applicant_last_name.min' },
        { type: 'maxlength', message: 'Vacancy.massages.applicant_last_name.max' },
      ],
      'applicant_phone': [
        { type: 'required', message: 'Vacancy.massages.applicant_phone.required' },
        { type: 'minlength', message: 'Vacancy.massages.applicant_phone.min' },
        { type: 'maxlength', message: 'Vacancy.massages.applicant_phone.max' },
        { type: 'pattern', message: 'Vacancy.massages.applicant_phone.pattern' }

      ],
      'applicant_email': [
        { type: 'required', message: 'Vacancy.massages.applicant_email.required' },
        { type: 'pattern', message: 'Vacancy.massages.applicant_email.pattern' }
      ],
      'highest_qualification': [
        { type: 'required', message: 'Vacancy.massages.highest_qualification.required' },
      ],
      'documentURL': [
        { type: 'required', message: 'Vacancy.massages.documentURL.required' },
      ],



    }

  }

  async activate() {

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
          status: data.status,
          applicant_first_name: data.applicant_first_name,
          applicant_last_name: data.applicant_last_name,
          documentURL: url,
          applicant_phone: data.applicant_phone,
          applicant_email: data.applicant_email,
          highest_qualification: data.highest_qualification,
          recent_job_role: data.recent_job_role,
          isCurrentlyEmployed: data.isCurrentlyEmployed,
          applicant_summry: data.applicant_summry,
          comments: data.comments,
          vacancyID: data.vacancyID,
        })
        let forming = this.addForm.value
        let user = await this.authz.AddApplicationVacancy(forming)
        await this.app.dismissLoading();
        this.dismiss();
      } catch (e) {
        console.log(e);
      }
    } else {
      this.addForm.markAllAsTouched();
      await this.app.dismissLoading();    }
  }

  async step0() {
    this.segment = 0
  }
  async step1() {
    this.segment = 1
  }
  async step2() {
    this.segment = 2
  }
  async step3() {
    this.segment = 3
  }

  dismiss() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }
}



@Component({
  selector: 'application-details',
  templateUrl: './application-details.html',
})
export class ApplicationDetailsModal implements OnInit {
  isLoading = true;
  addressForm: FormGroup;
  segment: number;
  addForm: FormGroup;
  @Input('vacancyApplication') vacancyApplication: VacancyApplication;
  isCurrentlyEmployed: boolean
  fileTransfer: FileTransferObject = this.transfer.create()
  constructor(private transfer: FileTransfer, public modalCtrl: ModalController, private app: AppService, fb: FormBuilder, public authz: AuthzService) {


    this.addForm = fb.group({
      id: [,],
      status: [,],
      applicant_first_name: [,],
      applicant_last_name: ['',],
      applicant_phone: ['',],
      applicant_email: ['', []],
      documentURL: ['', []],
      highest_qualification: ['',],
      isCurrentlyEmployed: ['',],
      recent_job_role: ['',],
      applicant_summry: ['',],
      comments: ['',],
      vacancyID: ['',],


    });


  }
  saveFile() {

  }

  async download() {


    if (this.vacancyApplication.documentURL && this.vacancyApplication.documentURL != '' && this.vacancyApplication.documentURL != 'null') {
      saveAs(`${environment.storageURL}/public/uploads/document/${this.vacancyApplication.documentURL}`, this.vacancyApplication.documentURL);

    } else {
      await this.app.presentAlert('Sorry ~', 'There is no file to dawnload it ', 'errorAlert');

    }
  }
  async ngOnInit() {
    this.isCurrentlyEmployed = false
    this.addForm.setValue({
      id: this.vacancyApplication.id,
      status: this.vacancyApplication.status,
      applicant_first_name: this.vacancyApplication.applicant_first_name,
      applicant_last_name: this.vacancyApplication.applicant_last_name,
      documentURL: this.vacancyApplication.documentURL,
      applicant_phone: this.vacancyApplication.applicant_phone,
      applicant_email: this.vacancyApplication.applicant_email,
      highest_qualification: this.vacancyApplication.highest_qualification,
      recent_job_role: this.vacancyApplication.recent_job_role,
      isCurrentlyEmployed: this.vacancyApplication.isCurrentlyEmployed,
      applicant_summry: this.vacancyApplication.applicant_summry,
      comments: this.vacancyApplication.comments,
      vacancyID: this.vacancyApplication.vacancyID

    })



  }

  async activate() {

  }


  async add() {
    await this.app.presentLoading();
    if (this.addForm.valid) {
      let data = this.addForm.value;
      try {
        await this.authz.UpdateVacancyApplication(data);
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

  async step0() {
    this.segment = 0
  }
  async step1() {
    this.segment = 1
  }
  async step2() {
    this.segment = 2
  }
  async step3() {
    this.segment = 3
  }

  dismiss() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }
}





@Component({
  selector: 'update-vacancy',
  templateUrl: './update-vacancy.html',
})
export class UpdateVacancyModal implements OnInit {

  @Input('Vacancy') Vacancy: Vacancy;
  isLoading = true;
  addressForm: FormGroup;
  segment: number;
  addForm: FormGroup;
  departments: Department[];
  tags: any;
  public openingAt: string = new Date().toISOString();
  description: string;
  validation_messages: any;
  picURL: any;
  constructor(public modalCtrl: ModalController, private app: AppService, fb: FormBuilder, public authz: AuthzService, public lang: LanguageService,) {


    this.addForm = fb.group({
      id: ['',],
      departmentID: ['',],
      number_of_openings: ['', [Validators.required, Validators.pattern('[0-9]+')]],
      code: [,],
      coverURL: ['',],
      tags: ['',],
      description: ['',],
      position: ['', [Validators.compose([Validators.maxLength(25), Validators.required])]],
      location: ['', [Validators.compose([Validators.maxLength(25), Validators.required])]],
      type: ['', [Validators.required]],
      status: ['', [Validators.required]],
      openingAt: ['', [Validators.required]],
      closingAt: ['', [Validators.required]],
      createdAt: ['',],
      education_level: ['', [Validators.required]],

    });

  }
  async ngOnInit() {

    this.description = " ";
    this.departments = await this.authz.getAllDepartment()
    this.description = this.Vacancy.description
    this.addForm.setValue({
      id: this.Vacancy.id,
      number_of_openings: this.Vacancy.number_of_openings,
      code: this.Vacancy.code,
      coverURL: this.Vacancy.coverURL,
      tags: this.Vacancy.tags,
      description: this.Vacancy.description,
      position: this.Vacancy.position,
      location: this.Vacancy.location,
      type: this.Vacancy.type,
      status: this.Vacancy.status,
      openingAt: this.Vacancy.openingAt,
      closingAt: this.Vacancy.closingAt,
      createdAt: this.Vacancy.createdAt,
      education_level: this.Vacancy.education_level,
      departmentID: this.Vacancy.departmentID
    })
    this.validation_messages = {
      'applicant_first_name': [
        { type: 'required', message: 'Vacancy.massages.applicant_first_name.required' },
        { type: 'minlength', message: 'Vacancy.massages.applicant_first_name.min' },
        { type: 'maxlength', message: 'Vacancy.massages.applicant_first_name.max' },
      ],
      'applicant_last_name': [
        { type: 'required', message: 'Vacancy.massages.applicant_last_name.required' },
        { type: 'minlength', message: 'Vacancy.massages.applicant_last_name.min' },
        { type: 'maxlength', message: 'Vacancy.massages.applicant_last_name.max' },
      ],
      'applicant_phone': [
        { type: 'required', message: 'Vacancy.massages.applicant_phone.required' },
        { type: 'minlength', message: 'Vacancy.massages.applicant_phone.min' },
        { type: 'maxlength', message: 'Vacancy.massages.applicant_phone.max' },
        { type: 'pattern', message: 'Vacancy.massages.applicant_phone.pattern' }

      ],
      'applicant_email': [
        { type: 'required', message: 'Vacancy.massages.applicant_email.required' },
        { type: 'pattern', message: 'Vacancy.massages.applicant_email.pattern' }
      ],
      'highest_qualification': [
        { type: 'required', message: 'Vacancy.massages.highest_qualification.required' },
      ],




    }
  }




  async add() {
    if (this.addForm.valid) {
      await this.app.presentLoading();
      let data = this.addForm.value;
      let url
      try {

        await this.addForm.setValue({
          id: data.id,
          number_of_openings: data.number_of_openings,
          code: data.code,
          coverURL: "",
          tags: data.tags,
          description: this.description,
          position: data.position,
          location: data.location,
          type: data.type,
          status: data.status,
          openingAt: data.openingAt,
          closingAt: data.closingAt,
          createdAt: data.openingAt,
          education_level: data.education_level,
          departmentID: data.departmentID
        })
        let forming = this.addForm.value
        await this.authz.UpdateVacancy(forming)
        await this.app.dismissLoading();

        this.dismiss();
        this.Vacancy = await this.addForm.value;
        this.ngOnInit()


      } catch (e) {
        console.log(e);
      }
    } else {
      this.addForm.markAllAsTouched();
      await this.app.dismissLoading();
     // await this.app.presentAlert('Sorry ~', 'Please Fill the required fields with valid values.', 'errorAlert');
    }
  }


  async step0() {
    this.segment = 0
  }
  async step1() {
    this.segment = 1
  }
  async step2() {
    this.segment = 2
  }
  async step3() {
    this.segment = 3
  }

  dismiss() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }
}

