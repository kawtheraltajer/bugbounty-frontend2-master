import { moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDrawer, MatDrawerMode } from '@angular/material/sidenav';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, PopoverController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { EmployeePickerComponent } from 'src/app/components/pickers/employee-picker/employee-picker.component';
import { Appraisal, AppraisalSection, AppraisalStatus, Employee, SectionBlock, User } from 'src/app/interfaces/types';
import { AppService } from 'src/app/services/app.service';
import { AppraisalService } from 'src/app/services/appraisal.service';
import { AuthzService } from 'src/app/services/authz.service';
import { LanguageService } from 'src/app/services/language.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {

  isEditMode = true;
  @ViewChild('drawer') drawer: MatDrawer;
  appraisalID: number
  expansions: any[] = []
  side: {
    mode: MatDrawerMode,
    position: "end" | "start",
    opened: boolean,

  } = {
      mode: 'side',
      opened: true,
      position: 'end'
    }
  appraisal: Appraisal;
  newApproval: {
    employee?: Employee,
    isMandatory?: boolean,
    isApproved?: boolean
  } = {
      isMandatory: false
    }
  isLoading = true;
  nextPhase: AppraisalStatus = 'CreationPhase';
  defaultData: Appraisal;
  subs: Subscription[] = [];
  user: User;
  delete_list_block = [];
  delete_list_sections = [];
  userID:number
  constructor(
    public app: AppService,
    public auth: AuthService,
    public authz: AuthzService,
    public appraisalService: AppraisalService,
    private rt: Router,
    private act: ActivatedRoute,
    public lang: LanguageService,
    public popoverController: PopoverController,
    private modalController: ModalController,
    private router: Router) { 
      /*if (!(this.authz.canDo('READ', 'Appraisal', []) || this.authz.canDo('MANAGE', 'Appraisal', []))) {
        this.router.navigateByUrl(`/login`)
      }*/
    }

  async ngOnInit() {
    /*if (!(this.authz.canDo('READ', 'Appraisal', []) || this.authz.canDo('MANAGE', 'Appraisal', []))) {
      this.router.navigateByUrl(`/login`)
    }*/
    // this.drawer.toggle();
    this.delete_list_sections=[];
    this.delete_list_block=[];

    let rtParam = this.act.snapshot.params.id;
    console.log('rtParam', rtParam);

    if (rtParam == null || rtParam == undefined || rtParam == 'null' || rtParam == 'undefined') {
      this.rt.navigateByUrl('/hcm/appraisal/list')
    } else {
      this.appraisalID = this.act.snapshot.params.id;
      this.appraisal = await this.appraisalService.getAppraisal(this.appraisalID);
      this.appraisal.sections.forEach((sec, i) => {
        this.calculateSection(i);
      });
      this.defaultData = this.appraisal;
      console.log('Appraisal :', this.appraisal);

      switch (this.appraisal.status) {
        case 'CreationPhase':
          this.nextPhase = 'EvaluationPhase';
          break;
        case 'EvaluationPhase':
          this.isEditMode = false;
          this.nextPhase = 'FeedbackPhase';
          break;
        case 'FeedbackPhase':
          this.nextPhase = 'ApprovalPhase';
          this.isEditMode = false;
          break;
        case 'ApprovalPhase':
          this.nextPhase = 'Completed';
          this.isEditMode = false;
          break;
        default:
          break;
      }
      let user$ = this.auth.userData.subscribe(user => {
        if (user) {
          this.user = user;
          if (user.employee.id != this.appraisal.appraiser.id) {
            this.isEditMode = false;
          }
        } else {
          this.isEditMode = false;
        }
      })
      this.subs.push(user$);
    }
    this.isLoading = false;

  }
  ngAfterViewInit() {

    ['xl', '2xl'].includes(this.app.screenSize) ?
      setTimeout(() => {
        this.drawer.toggle()
      }, 1100) : null
  }

  settings(type) { }

  dropBlock(event) {
    moveItemInArray(this.appraisal.sections[0].blocks, event.previousIndex, event.currentIndex);
  }
  dropSection(event) {
    moveItemInArray(this.appraisal.sections, event.previousIndex, event.currentIndex);
  }

  calculateSection(sectionIndex: number) {
    console.log(`--------- Calc Section ${sectionIndex} ----------`);
    let total_w = 0;
    let total_s = 0;
    let type = this.appraisal.sections[sectionIndex].type;
    if (type == 'OutOF100' || type == 'OutOF5') {
      this.appraisal.sections[sectionIndex].blocks.forEach(bl => {
        bl.score = bl.weightage && bl.rate ? (bl.weightage * bl.rate) / 100 : 0;
        total_w += bl.weightage;
        total_s += bl.score
      });
      this.appraisal.sections[sectionIndex].total_weightage = total_w;
      this.appraisal.sections[sectionIndex].total_score = total_s;

    } else if (type == 'Objective') {
      this.appraisal.sections[sectionIndex].blocks.forEach(bl => {
        bl.score = bl.weightage && bl.completion_percentage ? (bl.weightage * bl.completion_percentage) / 100 : 0;
        total_w += bl.weightage;
        total_s += bl.score
      });
      this.appraisal.sections[sectionIndex].total_weightage = total_w;
      this.appraisal.sections[sectionIndex].total_score = total_s;
    } else if (type == 'PassFail') {
      this.appraisal.sections[sectionIndex].blocks.forEach(bl => {
        bl.score = bl.weightage && bl.rate ? (bl.weightage * bl.rate) / 100 : 0;
        total_w += bl.weightage;
        total_s += bl.score
      });
      this.appraisal.sections[sectionIndex].total_weightage = total_w;
      this.appraisal.sections[sectionIndex].total_score = total_s;
    }
  }

  identify(index, item) {
    return index;
  }
  addBlock(sectionIndex: number, blockIndex: number) {
    if (this.appraisal.sections[sectionIndex].blocks?.length > 0) {
      this.appraisal.sections[sectionIndex].blocks.splice(blockIndex + 1, 0, {
        title: '',
        description: '',
        score: 0,
        weightage: 0,
        rate: 0,
      })
    } else {
      this.appraisal.sections[sectionIndex].blocks = [{
        title: '',
        description: '',
        score: 0,
        weightage: 0,
        rate: 0,
      }]
    }
  }

  toggleExpansionPanel(sectionIndex: number,) {
    console.log('toggle');

    let exp = document.getElementById(`section-${sectionIndex}`) as any;
    console.log(exp);

    exp.toggle();
  }

  deleteBlock(sectionIndex: number, blockIndex: number) {
    let block_id= this.appraisal.sections[sectionIndex].blocks[blockIndex].id
    this.appraisal.sections[sectionIndex].blocks.splice(blockIndex, 1)
      this.appraisalService.deleteBlock(block_id)
    
  }
  addSection(sectionIndex: number) {
    this.appraisal.sections.splice(sectionIndex + 1, 0, { blocks: [] })
  }
  deleteSection(sectionIndex: number) {
   let section_id= this.appraisal.sections[sectionIndex].id
    this.appraisalService.deletSection(section_id)
    this.appraisal.sections.splice(sectionIndex, 1)
  }

  async updateAppraisal() {
    let section_index = 0;
    for await (const section of this.appraisal.sections) {
      let { expanded, blocks, ...data } = section;
      data.appraisalID = this.appraisal.id;
      section.index = section_index;
      section.appraisalID = this.appraisal.id;
      blocks = blocks.map((bl, i) => { bl.index = i; return bl; });
      if (section.id) {
        await this.appraisalService.updateSection(data);
        for await (const block of blocks) {
          if (block.id) {
            await this.appraisalService.updateBlock(block);
          } else {
            await this.appraisalService.createBlock({
              sectionID: section.id,
              ...block
            });
          }



        }
      } else {
        console.log({ blocks, ...data });
        await this.appraisalService.createSection({ blocks, ...data });
      }
      section_index++;
    }
    // this.defaultData
  }
approval(){

}
  async proceedToNextPhase() {

    switch (this.appraisal.status) {
      case 'CreationPhase':
        this.appraisal.status = 'EvaluationPhase';
        this.nextPhase = 'FeedbackPhase';
        this.appraisalService.updateapprisal(this.appraisal)

        this.isEditMode = false;
        return
        break;
      case 'EvaluationPhase':
        this.isEditMode = false;
        this.appraisal.status = 'FeedbackPhase';
        this.nextPhase = 'ApprovalPhase';
        this.appraisalService.updateapprisal(this.appraisal)

        return
        break;
      case 'FeedbackPhase':
        this.appraisal.status = 'ApprovalPhase';
        this.nextPhase = 'Completed';
    this.appraisalService.updateapprisal(this.appraisal)

        this.isEditMode = false;
        return
        break;
      case 'ApprovalPhase':
        this.appraisal.status = 'Completed';
        this.appraisalService.updateapprisal(this.appraisal)

        this.nextPhase = 'Archived';
        this.isEditMode = false;
 
        return
        break;
      default:
        break;
    }



    this.appraisalService.updateapprisal(this.appraisal)
    this.appraisal.status = this.nextPhase;
  }

  async addApproval() {
    if (this.newApproval.employee) {

      this.appraisal.approvals ? null : this.appraisal.approvals = [];
      await this.appraisalService.createApproval({
        byID: this.newApproval.employee.id,
        appraisalID: this.appraisal.id,
        isApproved: false,
        isMandatory: this.newApproval.isMandatory,
      });
      this.appraisal.approvals.push({
        byID: this.newApproval.employee.id,
        by: this.newApproval.employee,
        isApproved: false,
        isMandatory: this.newApproval.isMandatory,
        appraisalID: this.appraisal.id
      });
      this.newApproval = {};
    } else {
      this.app.presentErrorAlert('Error', 'Please Select Employee', 'OK')
    }
  }

  async selectApproval(ev) {
    let emp = await this.selectEmployee(ev, {
      isCustomList: false,
      isGroupEmployees: false,
      exclude: this.appraisal.approvals ? this.appraisal.approvals.map(dt => dt.byID) : [],
    })

    if (emp) {
      console.log(emp);
      this.newApproval.employee = emp;
    }
  }

  async selectEmployee(ev: any, props: any) {
    return new Promise<Employee>(async (resolve, reject) => {
      const mdl = await this.modalController.create({
        component: EmployeePickerComponent,
        componentProps: props
      });

      await mdl.present();
      mdl.onWillDismiss().then(dt => {
        if (dt && dt.data && !dt.data.isCancel && dt.data.employee) {
          resolve(dt.data.employee)
        }
        resolve(null)
      });
    })
  }
}
