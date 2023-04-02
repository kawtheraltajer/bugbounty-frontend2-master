import { Announcement } from './../../interfaces/types';
import { LeaveType, Leave, Employee } from 'src/app/interfaces/types';;
import { Input, OnInit, ViewChild, Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { AppService } from 'src/app/services/app.service';
import { AuthzService } from 'src/app/services/authz.service';
import { LanguageService } from 'src/app/services/language.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import * as moment from 'moment';
import { CourtService } from 'src/app/services/court.service'
import { environment } from 'src/environments/environment';


@Component({
  selector: 'announcement',
  templateUrl: './announcement.component.html',
  styleUrls: ['./announcement.component.scss'],
})
export class AnnouncementComponent implements OnInit {

  currentAnnouncement: Announcement;
  imgURL;
  docURL;
  title;
  description;
  current_date=new Date();
 
  constructor(public lang: LanguageService, public modalController: ModalController, public app: AppService, public authz: AuthzService, private router: Router, public user: UserService, public Court: CourtService) { }

  async ngOnInit() {
    this.current_date.setHours(0,0,0,0);
    this.currentAnnouncement = await this.Court.getCurrentAnnouncement(this.current_date)
    if(this.currentAnnouncement)
    {
      if(this.currentAnnouncement.image)
        this.imgURL = this.getImgURL(this.currentAnnouncement.image);

      if(this.currentAnnouncement.document)
        this.docURL = this.currentAnnouncement.document;
        
      this.title = this.currentAnnouncement.title;
      this.description = this.currentAnnouncement.description;
    }
  }

  async download(event, Document) {
    if (Document != '' && Document != 'null' && Document != null) {
     
      saveAs(`${environment.storageURL}/public/uploads/document/announcement/${Document}`, Document);
    }

    else {
      if (this.lang.selectedLang == 'en') {
        await this.app.presentAlert('Sorry ~', 'There is no file to dawnload it ', 'errorAlert');
      }
      else {
        await this.app.presentAlert('خطأ ~', 'لا يوجد ملف لتحميله', 'errorAlert');
      }
    }

    event.stopPropagation();
  }

  getImgURL(imgPath: string) {
    return this.Court.getAnnouncementPicURL(imgPath);
  }

  goToAnnouncement() {
    this.router.navigate(['../../announcement/'])
  }

}

@Component({
  selector: 'add-announcement',
  templateUrl: './add-announcement.html',
})

export class AddAnnouncementModal implements OnInit {
  fromDate;
  isLoading = true;
  addForm: FormGroup;
  validation_messages: any;
  constructor(public modalCtrl: ModalController, public Court: CourtService, fb: FormBuilder, public router: Router, public lang: LanguageService, public modalController: ModalController, public app: AppService, public court: CourtService, public authz: AuthzService) {

    this.addForm = fb.group({
      title: ['', [Validators.required]],
      description: ['',],
      fromDate: ['', [Validators.required]],
      toDate: ['', [Validators.required]],
      image: ['',],
      document: ['',]
    });
  } async ngOnInit() {

    this.validation_messages = {
      'title': [
        { type: 'required', message: 'Announcement.messages.title.required' },
      ],
      'fromDate': [
        { type: 'required', message: 'Announcement.messages.fromDate.required' },
      ],
      'toDate': [
        { type: 'required', message: 'Announcement.messages.toDate.required' },
      ]
    }
  }

  async add() {
    if (this.addForm.valid) {
      await this.app.presentLoading();
      let { image, document, ...data } = this.addForm.value;
      let picURL = null;
      let docURL = null;
      try {
        if (image) {
          let img = image.files[0];
          let uploaded;
          if (img) {
            uploaded = await this.Court.uploadAnnouncementImage(img);
            if (uploaded?.file.filename) {
              picURL = uploaded?.file.filename;
            }
          }
        }
        await this.addForm.get('image').setValue(picURL);

        if (document) {
          let doc = document.files[0];
          let uploaded;
          if (doc) {
            uploaded = await this.Court.uploadAnnouncementDocument(doc);
            if (uploaded?.file.filename) {
              docURL = uploaded?.file.filename;
            }
          }
        }
        await this.addForm.get('document').setValue(docURL);

        await this.Court.createAnnouncement(this.addForm.value);
        this.ngOnInit()
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
  selector: 'announcement-list',
  templateUrl: './announcement-list.html',
})
export class AnnouncementListComponent implements OnInit {

  announcement_list: Announcement[];
  length;
  filter: {
    From_Date: Date,
    To_Date: Date
  }
  period: string = "ThisYear"
  current_date=new Date();

  constructor(public lang: LanguageService, public modalController: ModalController, public app: AppService, public authz: AuthzService, private router: Router, public user: UserService, public Court: CourtService) { 
    this.filter = {
      From_Date : new Date(this.current_date.getFullYear(), 0, 1),
      To_Date : new Date(this.current_date.getFullYear(), 12, 0)
    }
  }

  async ngOnInit() {
    this.current_date.setHours(0,0,0,0);
    this.announcement_list = await this.Court.getAllAnnouncements(this.filter);
    this.length = this.announcement_list.length;
  }

  async download(event, Document) {
    if (Document != '' && Document != 'null' && Document != null) {
      saveAs(`${environment.storageURL}/public/uploads/document/announcement/${Document}`, Document);

    }

    else {
      if (this.lang.selectedLang == 'en') {
        await this.app.presentAlert('Sorry ~', 'There is no file to dawnload it ', 'errorAlert');
      }
      else {
        await this.app.presentAlert('خطأ ~', 'لا يوجد ملف لتحميله', 'errorAlert');
      }
    }

    event.stopPropagation();
  }

  async add() {
    const modal = await this.modalController.create({ component: AddAnnouncementModal, cssClass: 'responsiveModal'});
    modal.onWillDismiss().then(data => {
      this.ngOnInit()
    });
    return await modal.present();
  }

  async update(id) {
    const modal = await this.modalController.create({ component: UpdateAnnouncementModal, cssClass: 'responsiveModal', componentProps: { AnnID: id }});
    modal.onWillDismiss().then(data => {
      this.ngOnInit()
    });
    return await modal.present();
  }

  getImgURL(imgPath: string) {
    return this.Court.getAnnouncementPicURL(imgPath);
  }

  SelectedReportType() {
    if (this.period == "ThisMonth") {
      this.filter.From_Date = new Date(this.current_date.getFullYear(), this.current_date.getMonth(), 1);
      this.filter.To_Date = new Date(this.current_date.getFullYear(), this.current_date.getMonth() + 1, 0);
    }
    else if (this.period== "ThisYear") {
      this.filter.From_Date = new Date(this.current_date.getFullYear(), 0, 1);
      this.filter.To_Date = new Date(this.current_date.getFullYear(), 12, 0);
    }
  }

  Apply() {
    this.ngOnInit()
  }

}

@Component({
  selector: 'update-announcement',
  templateUrl: './update-announcement.html',
})

export class UpdateAnnouncementModal implements OnInit {

  @Input('AnnID') AnnID: number;

  announcement: Announcement;
  fromDate;
  picChanged = false;
  docChanged = false;
  isLoading = true;
  updateForm: FormGroup;
  validation_messages: any;

  constructor(public modalCtrl: ModalController, public Court: CourtService, fb: FormBuilder, public router: Router, public lang: LanguageService, public modalController: ModalController, public app: AppService, public court: CourtService, public authz: AuthzService) {

    this.updateForm = fb.group({
      id: ['',],
      title: ['', [Validators.required]],
      description: ['',],
      fromDate: ['', [Validators.required]],
      toDate: ['', [Validators.required]],
      image: ['',],
      document: ['',]
    });
  } async ngOnInit() {

    this.validation_messages = {
      'title': [
        { type: 'required', message: 'Announcement.messages.title.required' },
      ],
      'fromDate': [
        { type: 'required', message: 'Announcement.messages.fromDate.required' },
      ],
      'toDate': [
        { type: 'required', message: 'Announcement.messages.toDate.required' },
      ]
    }

    this.announcement = await this.court.getOneAnnouncement(this.AnnID);
    
    this.updateForm.setValue({
      id: this.announcement.id,
      title: this.announcement.title,
      description:this.announcement.description,
      fromDate: this.announcement.fromDate,
      toDate: this.announcement.toDate,
      image: this.announcement.image,
      document: this.announcement.document
    })

  }

  async update() {
    if (this.updateForm.valid) {
      await this.app.presentLoading();
      if(this.picChanged)
      {
        let { image, ...data } = this.updateForm.value;
        let picURL = null;
        try {
          if (image) {
            let img = image.files[0];
            let uploaded;
            if (img) {
              uploaded = await this.Court.uploadAnnouncementImage(img);
              if (uploaded?.file.filename) {
                picURL = uploaded?.file.filename;
              }
            }
          }
          await this.updateForm.get('image').setValue(picURL);
        } catch (e) {
          console.log(e);
        }
      }
      if(this.docChanged)
      {
        let { document, ...data } = this.updateForm.value;
        let docURL = null;
        try {

          if (document) {
            let doc = document.files[0];
            let uploaded;
            if (doc) {
              uploaded = await this.Court.uploadAnnouncementDocument(doc);
              if (uploaded?.file.filename) {
                docURL = uploaded?.file.filename;
              }
            }
          }
          await this.updateForm.get('document').setValue(docURL);
        } catch (e) {
          console.log(e);
        }
      }

      await this.Court.updateAnnouncement(this.updateForm.value);
      this.ngOnInit()
      await this.app.dismissLoading();
      this.dismiss();
      
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

  imageChanged() {
    this.picChanged = true
  }

  documentChanged() {
    this.docChanged = true
  }

  async deleteAnnouncement() {
    let confirm = await this.app.presentConfirmAlert("Operations.Confirm", "Announcement.Errors.confirm_delete", "Operations.Cancel", "Operations.Confirm", true)
    if (confirm) {
      await this.court.deleteAnnouncement(this.AnnID)
      this.dismiss()
      this.ngOnInit()
    }
  }
}
