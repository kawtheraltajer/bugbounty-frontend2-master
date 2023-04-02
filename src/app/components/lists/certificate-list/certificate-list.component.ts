import { data } from 'autoprefixer';
import { SelectionModel } from '@angular/cdk/collections';
import { Employee } from 'src/app/interfaces/types';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AfterViewInit, ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';

import { ModalController } from '@ionic/angular';
import { Permission, Role, User ,Certificate} from 'src/app/interfaces/types';
import { AppService } from 'src/app/services/app.service';
import { AuthzService } from 'src/app/services/authz.service';
import { LanguageService } from 'src/app/services/language.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'certificate-list',
  templateUrl: './certificate-list.component.html',
  styleUrls: ['./certificate-list.component.scss'],
})
export class CertificateListComponent implements OnInit {
  @Input('isEdit') isEdit: boolean;
  @Input('certificates') certificates: Certificate[];
  @Input('isAdd') isAdd: boolean = false;
  @Input('employeeID') employeeID: number
  certificateColumns: string[];
  @Input('selectedcertificate') selectedcertificate: Certificate[];
  certificateList = new MatTableDataSource([]);
  @Input('showSelected') showSelected: boolean;
  selection = new SelectionModel<Employee>(true, []);
  @ViewChild('CertificateTablePaginator', { static: true }) tablePaginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  isSearch = false;
  searchTerm = '';
  data:any;
  constructor(public lang: LanguageService, public modalController: ModalController, public app: AppService, public authz: AuthzService) { }
  async ngOnInit() {

    
    this.data = await this.authz.getEmployee(this.employeeID);

    console.log()
    this.certificates=this.data.certificates
    this.certificateColumns = ['id', 'title', 'issue_date','Action',"Decument"];
    this.getDisplayedColumns();
    this.certificateList = new MatTableDataSource(this.certificates);
    this.certificateList.paginator = this.tablePaginator;
    if (this.selectedcertificate && this.showSelected) {
      let selectedIds = this.selectedcertificate.map(dt => dt.id);
    
    }

    }
    async ngOnChanges() {
      this.data = await this.authz.getEmployee(this.employeeID);

      console.log()
      this.certificates=this.data.certificates
      this.certificateList.data = this.certificates
      console.log(this.certificates)
    }
    async ngAfterViewInit() {
      this.data = await this.authz.getEmployee(this.employeeID);

      console.log()
      this.certificates=this.data.certificates
      this.certificateList = new MatTableDataSource(this.certificates);
      this.certificateList.paginator = this.tablePaginator;
      this.certificateList.sort = this.sort;
    }
    async activate(id, ev) {
      console.log(id);
      console.log(ev);
  
    }
 

    async Deletecertificate(row) {
      console.log('delete'+ row.id)
      let confirm = await this.app.presentConfirmAlert("Operations.Confirm", "Employee_managment.Employee-talents.Certificates.Errors.confirm_delete", "Operations.Cancel", "Operations.Confirm", true)
      console.log(confirm);
      
      if (confirm) {
        this.authz.deleteCertificate(row.id)
        this.ngOnInit()

      }
      
    }
    async download(Decument) {


      if (Decument!= '' && Decument != 'null' && Decument != null   ) {
        saveAs(`${environment.storageURL}/public/uploads/document/${Decument}`, Decument);
  
      } else {
        await this.app.presentAlert('Sorry ~', 'There is no file to dawnload it ', 'errorAlert');
  
      }
    }
    async add() {
      const modal = await this.modalController.create({ component: AddCertificateModal, cssClass: 'responsiveModal', componentProps: { employeeID: Number(this.employeeID)}});
      modal.onWillDismiss().then(data => {
        this.ngOnInit()
        console.log(data);
      });
      return await modal.present();
    }
  
    async details(row) {
    /*  console.log(row)
      const modal = await this.modalController.create({ component: EmployeeDetailsModal, cssClass: 'responsiveModal', componentProps: { id: row.id } });
      return await modal.present(); */
    }
  
     
    async Update(row) {
        console.log(row.id)
        const modal = await this.modalController.create({ component: UpdateCertificateModal, cssClass: 'responsiveModal', componentProps: { Certificateid: row.id , Certificate:row} });
        modal.onWillDismiss().then(data => {
          this.ngOnInit()
          console.log(data);
        });
        
        return await modal.present(); 
      }
    
    applyFilter() {
      this.certificateList.filter = this.searchTerm.trim().toLowerCase();
    }
  
    getDisplayedColumns(): string[] {
      return this.app.isDesktop ? this.certificateColumns : this.certificateColumns.filter(dt => dt !== 'Action');
    }

}


@Component({
  selector: 'add-certificate',
  templateUrl: './add-certificate.html',
})

export class AddCertificateModal implements OnInit {
  @Input('employeeID') employeeID: number;
  isLoading = true;
  addForm: FormGroup;
  validation_messages:any;
  constructor(public modalCtrl: ModalController, private app: AppService, fb: FormBuilder, public authz: AuthzService) {

    this.addForm = fb.group({
      employeeID:[, ],
      title: ['', [Validators.required]],
      issuer: ['', ],
      issue_date: ['', [Validators.required]],
      documentURL:[, [Validators.required]]

    });
  }
  async ngOnInit()
  {

    this.validation_messages = {
      'title': [
        { type: 'required', message: 'Employee_managment.Employee-talents.Certificates.massages.title.required' },
      ],
      'issuer': [
        { type: 'required', message: 'Employee_managment.Employee-talents.Certificates.massages.issuer.required' },
      ],
      'issue_date': [
        { type: 'required', message: 'Employee_managment.Employee-talents.Certificates.massages.issue_date.required' },
      ],
      'documentURL': [
        { type: 'required', message: 'Employee_managment.Employee-talents.Certificates.massages.documentURL.required' },

      ]




    }
    this.addForm.setValue({
      employeeID:this.employeeID ,
      title:"",
      issuer:"",
      issue_date:"",
      documentURL:""
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
          console.log("uploaded")

        console.log(uploaded)
        }

       await this.addForm.setValue({
        employeeID:this.employeeID ,
        title:data.title,
        issuer:data.issuer,
        issue_date:data.issue_date,
        documentURL:url

        })
        let forming = this.addForm.value
        let user = await this.authz.AddCertificate(forming)
        await this.app.dismissLoading();
        this.dismiss();
      } catch (e) {
        console.log(e);
      }
    } else {
      this.addForm.markAllAsTouched();
      await this.app.dismissLoading();    }
  }



  dismiss() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }
}






@Component({
  selector: 'update-certificate',
  templateUrl: './update-certificate.html',
})

export class UpdateCertificateModal implements OnInit {
  @Input('employeeID') employeeID: number;
  @Input('Certificateid') Certificateid: number;
  @Input('Certificate') Certificate: Certificate;
  validation_messages:any;
  isLoading = true;
  updateForm: FormGroup;
  constructor(public modalCtrl: ModalController, private app: AppService, fb: FormBuilder, public authz: AuthzService) {

    this.updateForm = fb.group({
      certificateID:[, ],
      employeeID:[, ],
      title: ['', [Validators.required]],
      issuer: ['', ],
      issue_date: ['', [Validators.required]],
      documentURL:[,]


    });
  
  
  }

  async Delete() {

    let confirm = await this.app.presentConfirmAlert("Operations.Confirm", "Employee_managment.Employee-talents.Certificates.Errors.confirm_delete", "Operations.Cancel", "Operations.Confirm", true)

    console.log(confirm);
    
    if (confirm) {
      this.authz.deleteCertificate(this.Certificate.id)
      this.dismiss()
      this.ngOnInit()

    }
    
  }
  async ngOnInit()
  {
    
    this.validation_messages = {
      'title': [
        { type: 'required', message: 'Employee_managment.Employee-talents.Certificates.massages.title.required' },
      ],
      'issuer': [
        { type: 'required', message: 'Employee_managment.Employee-talents.Certificates.massages.issuer.required' },
      ],
      'issue_date': [
        { type: 'required', message: 'Employee_managment.Employee-talents.Certificates.massages.issue_date.required' },
      ],
      'documentURL': [
        { type: 'required', message: 'Employee_managment.Employee-talents.Certificates.massages.documentURL.required' },

      ]

    }
    this.updateForm.setValue({
      certificateID:this.Certificate.id,
      employeeID:this.Certificate.employeeID ,
      title:this.Certificate.title,
      issuer:this.Certificate.issuer,
      issue_date:this.Certificate.issue_date,
      documentURL:this.Certificate.issuer
    })


  }
  async update() {
    await this.app.presentLoading();
    if (this.updateForm.valid) {
      let data = this.updateForm.value;
      try {
      await this.authz.updateCertificate(data);
        await this.app.dismissLoading();
        this.dismiss();
      } catch (e) {
        console.log(e);
      }
    } else {
      this.updateForm.markAllAsTouched();
      await this.app.dismissLoading();
      await this.app.presentAlert('Sorry ~', 'Please Fill the required fields with valid values.', 'errorAlert');
    }
  }

  dismiss() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }
}

