
import { CaseType } from './../../../interfaces/types';
import { AfterViewInit, ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { CourtService } from 'src/app/services/court.service';
import { LanguageService } from 'src/app/services/language.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { AppService } from 'src/app/services/app.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthzService } from 'src/app/services/authz.service';


@Component({
  selector: 'app-court-list',
  templateUrl: './court-list.page.html',
  styleUrls: ['./court-list.page.scss'],
})
export class CourtListPage implements OnInit {
  searchTerm:string
  courts: any = [];
  courtFilter:any[]
  isAdd = false;
  courtData: any = {
    name:""

  }
  courtform: FormGroup;
  validation_messages: any;

  constructor(public fb: FormBuilder, public courtServices: CourtService, public authz: AuthzService, public lang: LanguageService, public modalCtrl: ModalController, private router: Router, private app: AppService) {
    if (!(this.authz.canDo('READ', 'CaseType', []) || this.authz.canDo('MANAGE', 'CaseType', [])) &&
      ((this.authz.canDo('MANAGE', 'ClientAccess', []) ||
        this.authz.canDo('MANAGE', 'CompanyAccess', []) ||
        this.authz.canDo('MANAGE', 'LawyerAccess', [])))) {
      this.router.navigateByUrl(`/login`)
    }
  }
  public applyFilter(){
    let custom_search_val
    if(this.searchTerm.trim() =="شرعي"){
      custom_search_val="Lowful"
    }else if(this.searchTerm.trim() =="مدني"){
      custom_search_val="Civilian" 
    }
    else if(this.searchTerm.trim() =="جنائي"){
      custom_search_val="Criminal" 
    }
    else if(this.searchTerm.trim() =="تنفيذ"){
      custom_search_val="Excution" 
    }

    console.log(custom_search_val)
      return  this.courtFilter = this.courts.filter((val) => val.name.toLowerCase().includes(this.searchTerm.trim())
      );
       
      }
      clearSelectionCaseType(){
        this.courtFilter=this.courts
      }

  async ngOnInit() {
    if (!(this.authz.canDo('READ', 'CaseType', []) || this.authz.canDo('MANAGE', 'CaseType', [])) &&
      ((this.authz.canDo('MANAGE', 'ClientAccess', []) ||
        this.authz.canDo('MANAGE', 'CompanyAccess', []) ||
        this.authz.canDo('MANAGE', 'LawyerAccess', [])))) {
      this.router.navigateByUrl(`/login`)
    }
    this.courtform = this.fb.group({
      name: ['', [Validators.required]]

    });
    this.isAdd = false
     this.courts=await this.courtServices.getAllCourts()
     console.log( this.courts)
     this.courtFilter=this.courts
    this.validation_messages = {
      'name': [
        { type: 'required', message: 'Court.Cases.Case-type.Form.messages.name_ar.required' },
      ]
    }
  }

  ViewAddForm() {
    this.isAdd = !this.isAdd

  }


  async addType() {
    await this.app.presentLoading();
    if (this.courtform.valid) {
      console.log("this.typeform.value")
      try {
        this.courtData = this.courtform.value
        let added = await this.courtServices.createCourt(this.courtData);
        await this.app.dismissLoading();
        this.courtform.reset()
        this.isAdd = false;
        this.ngOnInit()
      } catch (e) {
        console.log(e);
      }
    } else {
      this.courtform.markAllAsTouched();
      await this.app.dismissLoading();
    }
  }

  clear() {
    this.courtform.reset()
      ;
    this.isAdd = false

  }

}
