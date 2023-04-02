import { TimeSlotDetailsComponent } from './../../schedule/time-slot-details/time-slot-details.component';
import { SelectionModel } from '@angular/cdk/collections';
import { Employee } from 'src/app/interfaces/types';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AfterViewInit, ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Permission, Experience} from 'src/app/interfaces/types';
import { AppService } from 'src/app/services/app.service';
import { AuthzService } from 'src/app/services/authz.service';
import { LanguageService } from 'src/app/services/language.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'experience-list',
  templateUrl: './experience-list.component.html',
  styleUrls: ['./experience-list.component.scss'],
})
export class ExperienceListComponent implements OnInit {
  @Input('isEdit') isEdit: boolean;
  @Input('id') id: number;
  @Input('employeeID') employeeID: number
  @Input('experiences') experiences: Experience[];
  @Input('isAdd') isAdd: boolean = false;
  experienceColumns: string[];
  @Input('selectedexperience') selectedexperience: Experience[];
  experienceList = new MatTableDataSource([]);
  @Input('showSelected') showSelected: boolean;
  selection = new SelectionModel<Experience>(true, []);
  @ViewChild('ExperienceTablePaginator', { static: true }) tablePaginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  isSearch = false;
  searchTerm = '';
  data:any;
  constructor(public lang: LanguageService, public modalController: ModalController, public app: AppService, public authz: AuthzService) { }
  async ngOnInit() {
    this.data = await this.authz.getEmployee(this.employeeID);
    this.experiences=this.data.experiences
    this.experienceColumns = ['id', 'company', 'position', 'address','duration','Action','Decument'];
    this.getDisplayedColumns();
    this.experienceList = new MatTableDataSource(this.experiences);
    this.experienceList.paginator = this.tablePaginator;
    if (this.selectedexperience && this.showSelected) {
      let selectedIds = this.selectedexperience.map(dt => dt.id);
      this.selection = new SelectionModel<Permission>(true, [
        ...this.experienceList.data.filter(row => selectedIds.includes(row.id))
      ]);
      this.experienceList.data = this.experiences

    }

    }
    async download(Decument) {


      if (Decument!= '' && Decument != 'null') {
        saveAs(`${environment.storageURL}/public/uploads/document/${Decument}`, Decument);
  
      } else {
        await this.app.presentAlert('Sorry ~', 'There is no file to dawnload it ', 'errorAlert');
  
      }
    }
   async ngOnChanges() {
      this.data = await this.authz.getEmployee(this.employeeID);
      this.experiences=this.data.experiences
      this.experienceList.data = this.experiences
    }
  async  ngAfterViewInit() {
      this.data = await this.authz.getEmployee(this.employeeID);
      this.experiences=this.data.experiences
      this.experienceList = new MatTableDataSource(this.experiences);
      this.experienceList.paginator = this.tablePaginator;
      this.experienceList.sort = this.sort;
    }
    async activate(id, ev) {
      console.log(id);
      console.log(ev);
  
    }
  
  
    async add() {
      console.log('id')
    const modal = await this.modalController.create({ component: AddExperienceModal, cssClass: 'responsiveModal',  componentProps: { employeeID: Number(this.employeeID) }});
      modal.onWillDismiss().then(data => {
        this.ngOnInit()
        console.log(data);
      });
      return await modal.present();
    }
    
    async Deleteexperience(row) {
      console.log('delete'+ row.id)
      let confirm = await this.app.presentConfirmAlert("Operations.Confirm", "Employee_managment.Employee-talents.Experiences.Errors.confirm_delete", "Operations.Cancel", "Operations.Confirm", true)
      console.log(confirm);
      
      if (confirm) {
        this.authz.deleteExperience(row.id)
        this.ngOnInit()

      }
      
    }
   
  
    async delete(row) {
      console.log(row)
        const modal = await this.modalController.create({ component: UpdateExperienceModal, cssClass: 'responsiveModal', componentProps: { Experience: row } });
        modal.onWillDismiss().then(data => {
          this.ngOnInit()
          console.log(data);
        });        return await modal.present(); 
      }
    async update(row) {
    console.log(row)
      const modal = await this.modalController.create({ component: UpdateExperienceModal, cssClass: 'responsiveModal', componentProps: { Experience: row } });
      modal.onWillDismiss().then(data => {
        this.ngOnInit()
        console.log(data);
      });
      return await modal.present(); 
    }
  
    applyFilter() {
      this.experienceList.filter = this.searchTerm.trim().toLowerCase();
    }
  
    getDisplayedColumns(): string[] {
      return this.app.isDesktop ? this.experienceColumns : this.experienceColumns.filter(dt => dt !== 'Action');
    }

}

@Component({
  selector: 'add-experience',
  templateUrl: './add-experience.html',
})

export class AddExperienceModal implements OnInit {
  @Input('employeeID') employeeID: number
  isLoading = true;
  addForm: FormGroup;
  validation_messages:any;
  constructor( public lang: LanguageService, public modalCtrl: ModalController, private app: AppService, fb: FormBuilder, public authz: AuthzService) {
  
    this.addForm = fb.group({
     
      employeeID: [, ],
      company  : ['', [Validators.required]],
      position : ['', [Validators.required]],
      address :  ['', ],
      duration  :['', ],
      documentURL: ['', [Validators.required]],

    });
  }
  async ngOnInit() {
    this.validation_messages = {
      'company': [
        { type: 'required', message: 'Employee_managment.Employee-talents.Education.massages.place.required' },
      ],
      'position': [
        { type: 'required', message: 'Employee_managment.Employee-talents.Education.massages.type.required' },
      ],
      'documentURL': [
        { type: 'required', message: 'Employee_managment.Employee-talents.Education.massages.documentURL.required' },

      ]

    }

    this.addForm.setValue({
      employeeID:this.employeeID,
      company:"",
      position:"",
      address: "",
      duration:"",
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

        console.log(url)
        }

       await this.addForm.setValue({
        employeeID:this.employeeID ,
        company:data.company,
        position:data.position,
        address:data.address,
        duration:data.duration,
        documentURL:url

        })
        let forming = this.addForm.value
        let user = await this.authz.AddExperience(forming)
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
  selector: 'update-experience',
  templateUrl: './update-experience.html',
})

export class UpdateExperienceModal implements OnInit {
  @Input('Experience') Experience: Experience;
  isLoading = true;
  updateForm: FormGroup;
  validation_messages:any;
  constructor(public modalCtrl: ModalController, private app: AppService, fb: FormBuilder, public authz: AuthzService) {

    this.updateForm = fb.group({
      ExperienceID:['', ], 
      employeeID:['', ],  
      company  : ['', [Validators.required]],
      position : ['', [Validators.required]],
      address :  ['', ],
      duration  :['', ],
      documentURL: ['', [Validators.required]],


    });
  }

  async Delete() {
    let confirm = await this.app.presentConfirmAlert("Operations.Confirm", "Employee_managment.Employee-talents.Experiences.Errors.confirm_delete", "Operations.Cancel", "Operations.Confirm", true)
    console.log(confirm);
    
    if (confirm) {
      this.authz.deleteExperience(this.Experience.id)
      this.dismiss()
      this.ngOnInit()

    }
    
  }
 
  async ngOnInit()
  {
    this.validation_messages = {
      'company': [
        { type: 'required', message: 'Employee_managment.Employee-talents.Education.massages.place.required' },
      ],
      'position': [
        { type: 'required', message: 'Employee_managment.Employee-talents.Education.massages.type.required' },
      ],
      'documentURL': [
        { type: 'required', message: 'Employee_managment.Employee-talents.Education.massages.documentURL.required' },

      ]

    }


    this.updateForm.setValue({
      ExperienceID:this.Experience.id,
      employeeID:this.Experience.employeeID,
      company:this.Experience.company,
      position:this.Experience.position,
      address: this.Experience.address,
      duration: this.Experience.duration,
      documentURL:this.Experience.company,
    })
    


  }
  async update() {
    await this.app.presentLoading();
    if (this.updateForm.valid) {
      let data = this.updateForm.value;
      try {
        await this.authz.updateExperience(data);
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



