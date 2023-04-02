import { LeaveType } from './../../../../../interfaces/types';
import { AfterViewInit, ChangeDetectionStrategy, Input, OnChanges, OnInit, ViewChild, Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { AppService } from 'src/app/services/app.service';
import { AuthzService } from 'src/app/services/authz.service';
import { LanguageService } from 'src/app/services/language.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from 'src/app/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-leave-types',
  templateUrl: './leave-types.page.html',
  styleUrls: ['./leave-types.page.scss'],
})

export class LeaveTypesPage implements OnInit {
  searchTerm = '';
     leaveType: LeaveType[];
  @Input('isAdd') isAdd: boolean = false;
  LeaveTypeColumns: string[];
  @Input('selecteLeaveType') selecteLeaveType: LeaveType[];
  LeaveTypeList = new MatTableDataSource([]);
  @Input('showSelected') showSelected: boolean;
  selection = new SelectionModel<LeaveType>(true, []);
  @ViewChild('LeaveTypeTablePaginator', { static: true }) tablePaginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  isSearch = false;
  constructor(public lang: LanguageService, public modalController: ModalController, public app: AppService, public authz: AuthzService, private router: Router, public user: UserService) { 
    /*if (!(this.authz.canDo('READ', 'LeaveType', []) || this.authz.canDo('MANAGE', 'LeaveType', []))) {
      this.router.navigateByUrl(`/login`)
    }*/
  }

  async ngOnInit() {
    /*if (!(this.authz.canDo('READ', 'LeaveType', []) || this.authz.canDo('MANAGE', 'LeaveType', []))) {
      this.router.navigateByUrl(`/login`)
    }*/
    console.log(this.leaveType)
 this.leaveType = await this.authz.getLeaveTypes();
 console.log(this.leaveType)

    this.LeaveTypeColumns = ['id', 'name','Action'];
    this.getDisplayedColumns();
    this.LeaveTypeList = new MatTableDataSource(this.leaveType);
    this.LeaveTypeList.paginator = this.tablePaginator;
    if (this.selecteLeaveType && this.showSelected) {
      let selectedIds = this.selecteLeaveType.map(dt => dt.id);
    
    }

    }
    getDisplayedColumns(): string[] {
      return this.LeaveTypeColumns
    }
    async ngOnChanges() {
      this.leaveType = await this.authz.getLeaveTypes();

      this.LeaveTypeList.data = this.leaveType
    }
    async ngAfterViewInit() {
      this.leaveType = await this.authz.getLeaveTypes();

      this.LeaveTypeList = new MatTableDataSource(this.leaveType);
      this.LeaveTypeList.paginator = this.tablePaginator;
      this.LeaveTypeList.sort = this.sort;
    }
    async activate(id, ev) {
      console.log(id);
      console.log(ev);
  
    }
  
  async add() {
    const modal = await this.modalController.create({ component: AddLeaveTypesPage, cssClass: 'responsiveModal' });
    modal.onWillDismiss().then(data => {
      this.ngOnInit()
      console.log(data);
    });
    return await modal.present();
  }

  async update(row) {
    const modal = await this.modalController.create({ component: UpdateLeaveTypesPage, cssClass: 'responsiveModal' , componentProps: { leaveType: row} });
    modal.onWillDismiss().then(data => {
      this.ngOnInit()

      console.log(data);
    });
    return await modal.present();
  }



  async delete(row) {
   let confirm = await  this.app.presentConfirmAlert("Operations.Confirm", "HCM.Workforce.leaves.Errors.confirm_delete", "Operations.Cancel", "Operations.Confirm", true)
    console.log(confirm);
    
    if (confirm) {
      this.authz.deleteLeaveType(row.id)
      this.ngOnInit()


    }
    
  }
tURL(imgPath: string) {
    return this.user.getProfilePicURL(imgPath);
  }


  applyFilter() {
    //this.employeeList.filter = this.searchTerm.trim().toLowerCase();
  }
 


}

@Component({
  selector: 'add-leave-types',
  templateUrl: './add-leave-type.html',
})

export class AddLeaveTypesPage implements OnInit {
  allowed_once:boolean;
  paid:boolean;
  validation_messages:any;
  addForm: FormGroup;
  detailsForm: FormGroup;
  LeaveType:LeaveType[];
  details: any=[];
  isDetails:Boolean;
  constructor(public modalCtrl: ModalController, private app: AppService, fb: FormBuilder, public authz: AuthzService) {
this.isDetails=false
    this.addForm = fb.group({
      name_ar: ['', [Validators.required]],
      name_en: ['',],
      allowed_per_year: ['', ],
      allowed_once: ['', ],
      paid: ['',],
      details:[]

  

    });
    this.detailsForm = fb.group({
      number_of_days: ['', ],
      paid_persentage: ['',],

    });
  }
  
  async ngOnInit() {
    this.isDetails=false

    this.allowed_once=false;
    this.paid=false 
    this.validation_messages = {
  
      'name_ar': [
        { type: 'required', message: 'HCM.Workforce.leaves.leave_Types.massages.name_ar.required' },

      ],
      'name_en': [
        { type: 'required', message: 'HCM.Workforce.leaves.leave_Types.massages.name_en.required' },
      ],
 
      'allowed_per_year': [
        { type: 'required', message: 'HCM.Workforce.leaves.leave_Types.massages.allowed_per_year.required' },
        { type: 'pattern', message: 'HCM.Workforce.leaves.leave_Types.massages.allowed_per_year.pattern' },

      ]

      
    
    }


  }

  IsDetails(){
    this.isDetails=!this.isDetails
    }
    clearDeduction(){
      this.isDetails=false
      this.detailsForm.reset()
    }
  async addDetails() {
    this.details.push(this.detailsForm.value);
    this.isDetails=false
    this.detailsForm.reset()

  }
  async add() {
    await this.app.presentLoading();
    if (this.addForm.valid) {
      let data = this.addForm.value;
      this.addForm.setValue({
        name_ar:this.addForm.value.name_ar,
        name_en:this.addForm.value.name_en,
        allowed_per_year:this.addForm.value.allowed_per_year,
        allowed_once:this.addForm.value.allowed_once,
        paid:this.addForm.value.paid,
        details:this.details
    })
  console.log('updated address ')
  console.log(data)
  
      try {
        await this.authz.AddLeaveType(data);
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
  selector: 'update-leave-types',
  templateUrl: './update-leave-type.html',
})

export class UpdateLeaveTypesPage implements OnInit {
  addForm: FormGroup;
  allowed_once:boolean;
  paid:boolean;
  @Input('leaveType') leaveType: LeaveType
  validation_messages:any
  detailsForm: FormGroup;
  LeaveType:LeaveType[];
  details: any=[];
  isDetails:Boolean;
  constructor(public modalCtrl: ModalController, private app: AppService,public  fb: FormBuilder, public authz: AuthzService) {
    this.addForm = fb.group({
      id: ['',],
      name_ar: ['', [Validators.required]],
      name_en: ['',],
      allowed_per_year: ['', [Validators.required]],
      allowed_once: ['', [Validators.required]],
      paid: ['',],
      details:['']

  

    });
    this.details=[];
    this.detailsForm = fb.group({
      number_of_days: ['', [Validators.required]],
      paid_persentage: ['',],

    });
  }
  async ngOnInit() {

    this.detailsForm = this.fb.group({
      number_of_days: ['', [Validators.required]],
      paid_persentage: ['',],

    });
    this.allowed_once=false;
    this.paid=false 
    this.addForm.setValue({
      id:this.leaveType.id,
      name_ar:this.leaveType?.name_ar,
      name_en:this.leaveType?.name_en,
      allowed_per_year:this.leaveType?.allowed_per_year,
      allowed_once:this.leaveType?.allowed_once,
      paid:this.leaveType?.paid,
      details:this.leaveType?.details
      
  }
  
)


if(this.leaveType?.details ){
  this.details=this.leaveType?.details
  this.isDetails=true;}
    this.validation_messages = {
  
      'name_ar': [
        { type: 'required', message: 'HCM.Workforce.leaves.leave_Types.massages.name_ar.required' },

      ],
      'name_en': [
        { type: 'required', message: 'HCM.Workforce.leaves.leave_Types.massages.name_en.required' },
      ],
 
      'allowed_per_year': [
        { type: 'required', message: 'HCM.Workforce.leaves.leave_Types.massages.allowed_per_year.required' },
        { type: 'pattern', message: 'HCM.Workforce.leaves.leave_Types.massages.allowed_per_year.pattern' },

      ]

      
    
    }



}
IsDetails(){
  this.isDetails=!this.isDetails
  }
  clearDeduction(){
    this.isDetails=false
    this.detailsForm.reset()
  }
async addDetails() {

  console.log(this.detailsForm.value)
  this.details.push(this.detailsForm.value);
  this.isDetails=false
  this.detailsForm.reset()

}
async update() {
  await this.app.presentLoading();
  if (this.addForm.valid) {
    let data = this.addForm.value;

console.log('updated address ')
console.log(data)
this.addForm.setValue({
  id:this.leaveType.id,
  name_ar:this.addForm.value.name_ar,
  name_en:this.addForm.value.name_en,
  allowed_per_year:this.addForm.value.allowed_per_year,
  allowed_once:this.addForm.value.allowed_once,
  paid:this.addForm.value.paid,
  details:this.details
})



    try {
      await this.authz.UpdateLeaveType(data);
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
async activate(isActive: boolean) {

}



dismiss() {
  this.modalCtrl.dismiss({
    'dismissed': true
  });
} 

}