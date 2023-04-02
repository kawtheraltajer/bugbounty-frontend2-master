import { Department, Vacancy } from './../../../interfaces/types';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { AppService } from 'src/app/services/app.service';
import { AuthzService } from 'src/app/services/authz.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuService } from 'src/app/services/menu.service';
import { MatDrawer } from '@angular/material/sidenav';
import { Component, ElementRef, OnInit, ViewChild, Input, Sanitizer } from '@angular/core';
import { EditorComponent } from '@tinymce/tinymce-angular';
import { DomSanitizer } from '@angular/platform-browser';



@Component({
  selector: 'app-site-vacancy',
  templateUrl: './site-vacancy.component.html',
})
export class SiteVacancyComponent implements OnInit {

  Vacancy: Vacancy[];
  isFromSite = false;
  Vacancy_number: number

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
    console.log(this.editorData);
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
    // directionality: 'rtl',
  }
  constructor(public modalCtrl: ModalController,
    public menu: MenuService,
    private app: AppService, fb: FormBuilder, public authz: AuthzService, private router: Router) { }
  getURL(coverURL: string) {
    return this.authz.getcoverURL(coverURL);
  }
  async ngOnInit() {
    this.Vacancy = await this.authz.getSiteVacancy()
    this.Vacancy_number = this.Vacancy.length
    if (this.router.url == '/jobs') {
      this.menu.disableMainMenu();
      this.isFromSite = true;
    }
  }


  async apply(Vacancy) {
    this.router.navigate(['/jobs', Vacancy.id])
  }
  dismiss() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }
}

@Component({
  selector: 'add-application-site',
  templateUrl: './add-application-site.html',
  styleUrls: ['./site-vacancy.component.scss']
})
export class AddApplicationSiteModal implements OnInit {
  @Input() isModal: boolean = false;
  isFromSite = false;
  @ViewChild('iframe') iframe;
  @Input() isEdit: boolean = false;
  isLoading = true;
  addressForm: FormGroup;
  segment: number;
  addForm: FormGroup;
  isCurrentlyEmployed: boolean
  vacancyID: number;
  Vacancy: Vacancy;
  validation_messages: any;
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
    console.log(this.editorData);
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
    // directionality: 'rtl',
  }
  description: any = '';
  constructor(public modalCtrl: ModalController,
    public menu: MenuService,
    public app: AppService, fb: FormBuilder,
    public sanitizer: DomSanitizer,
    public authz: AuthzService, private route: ActivatedRoute, private router: Router) {


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
    this.menu.menu.close();
    this.menu.disableMainMenu();

  }


  sani() {
    return this.sanitizer.bypassSecurityTrustHtml(this.description)
  }
  async ngOnInit() {
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

      ]




    }
    this.vacancyID = this.route.snapshot.params.id;
    await this.app.presentLoading();
    this.isLoading = true;
    this.authz.getVacancy(this.vacancyID).then(async dt => {
      if (!dt) {
        this.router.navigateByUrl('jobs')
      }
      this.Vacancy = dt;
      this.isLoading = false;
      this.description = this.Vacancy.description;
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
        vacancyID: Number(this.vacancyID),
      });
      await this.app.dismissLoading();
    }, error => {
      this.router.navigateByUrl('jobs')
    });


  }

  async activate() {

  }

  async uploadFile() {
    await this.app.presentLoading();
    let { documentURL, ...data } = this.addForm.value;
    let applicationDate = this.addForm.value;
    let url;
    if (this.addForm.value.documentURL) {
      let doc = documentURL.files[0];
      let uploaded;
      if (doc) {
        uploaded = await this.authz.uploadFile(doc);
        if (uploaded?.filename) {
          url = uploaded.filename;
        }
      }
    }

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
            if (uploaded?.filename) {
              url = uploaded.filename;
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
        await this.authz.AddApplicationVacancy(forming)
        await this.app.presentAlert('Done ~', 'Your Application has been Submited    |  لقد تم تقديم طلبك بنجاح', 'successAlert');

        await this.app.dismissLoading();
        this.router.navigateByUrl('jobs')
      } catch (e) {
        console.log(e);
      }
    } else {
      this.addForm.markAllAsTouched();
      await this.app.dismissLoading();
      //await this.app.presentAlert('Sorry ~', 'Please Fill the required fields with valid values.', 'errorAlert');
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





