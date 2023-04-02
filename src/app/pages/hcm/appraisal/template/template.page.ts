import { moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDrawer, MatDrawerMode } from '@angular/material/sidenav';
import { Router, ActivatedRoute } from '@angular/router';
import { PopoverController, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { EmployeePickerComponent } from 'src/app/components/pickers/employee-picker/employee-picker.component';
import { Appraisal, Employee, AppraisalStatus, User, AppraisalTemplate } from 'src/app/interfaces/types';
import { AppService } from 'src/app/services/app.service';
import { AppraisalService } from 'src/app/services/appraisal.service';
import { AuthzService } from 'src/app/services/authz.service';
import { LanguageService } from 'src/app/services/language.service';

@Component({
  selector: 'app-template',
  templateUrl: './template.page.html',
  styleUrls: ['./template.page.scss'],
})
export class TemplatePage implements OnInit {
  isEditMode = true;
  @ViewChild('drawer') drawer: MatDrawer;
  appraisal_templateID: number
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
  appraisal_template: AppraisalTemplate;
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
  delete_list_sections = []
  delete_list_block = []
  constructor(
    public app: AppService,
    public auth: AuthService,
    private appraisalService: AppraisalService,
    private rt: Router,
    private act: ActivatedRoute,
    public lang: LanguageService,
    public popoverController: PopoverController,
    private modalController: ModalController,
    public authz: AuthzService,
    private router: Router) { 
      /*if (!(this.authz.canDo('READ', 'Appraisal', []) || this.authz.canDo('MANAGE', 'Appraisal', []))) {
        this.router.navigateByUrl(`/login`)
      }*/
    }

  async ngOnInit() {
    /*if (!(this.authz.canDo('READ', 'Appraisal', []) || this.authz.canDo('MANAGE', 'Appraisal', []))) {
      this.router.navigateByUrl(`/login`)
    }*/
    this.delete_list_sections = [];
    this.delete_list_block = [];
    // this.drawer.toggle();
    let rtParam = this.act.snapshot.params.id;
    console.log('rtParam', rtParam);
    this.isLoading = true;
    if (rtParam == null || rtParam == undefined || rtParam == 'null' || rtParam == 'undefined') {
      this.rt.navigateByUrl('/hcm/templates')
    } else {
      this.appraisal_templateID = this.act.snapshot.params.id;
      await this.appraisalService.getAppraisalTemplate(this.appraisal_templateID).then(dt => {
        this.appraisal_template = dt;
        this.defaultData = dt;
        this.isLoading = false;
      });
    }
  }
  ngAfterViewInit() {
    ['xl', '2xl'].includes(this.app.screenSize) ?
      setTimeout(() => {
        this.drawer.toggle()
      }, 1100) : null
  }
  settings(type) { }
  dropBlock(event) {
    moveItemInArray(this.appraisal_template.sections[0].blocks, event.previousIndex, event.currentIndex);
  }
  dropSection(event) {
    moveItemInArray(this.appraisal_template.sections, event.previousIndex, event.currentIndex);
  }

  identify(index, item) {
    return index;
  }
  addBlock(sectionIndex: number, blockIndex: number) {
    if (this.appraisal_template.sections[sectionIndex].blocks?.length > 0) {
      this.appraisal_template.sections[sectionIndex].blocks.splice(blockIndex + 1, 0, {
        title: '',
        description: '',
        weightage: 0,
      })
    } else {
      this.appraisal_template.sections[sectionIndex].blocks = [{
        title: '',
        description: '',
        weightage: 0,
      }]
    }
  }
  deleteBlock(sectionIndex: number, blockIndex: number) {

    let block_id= this.appraisal_template.sections[sectionIndex].blocks[blockIndex].id

    this.appraisal_template.sections[sectionIndex].blocks.splice(blockIndex, 1)


      this.appraisalService.deleteBlock(block_id)
    
  }
  addSection(sectionIndex: number) {
    this.appraisal_template.sections.splice(sectionIndex + 1, 0, { blocks: [] })



  }
  deleteSection(sectionIndex: number) {

   let section_id= this.appraisal_template.sections[sectionIndex].id
    this.appraisalService.deletSection(section_id)
    this.appraisal_template.sections.splice(sectionIndex, 1)
  }
  toggleExpansionPanel(sectionIndex: number,) {
    console.log('toggle');
    let exp = document.getElementById(`section-${sectionIndex}`) as any;
    exp.toggle();
  }

  async updateAppraisal() {
    let section_index = 0;
    for await (const section of this.appraisal_template.sections) {
      let { expanded, blocks, ...data } = section;
      data.appraisal_templateID = this.appraisal_template.id;
      section.index = section_index;
      section.appraisal_templateID = this.appraisal_template.id;
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

  async addApproval() {
    if (this.newApproval.employee) {
      this.appraisal_template.approvals ? null : this.appraisal_template.approvals = [];
      await this.appraisalService.createApproval({
        byID: this.newApproval.employee.id,
        appraisal_templateID: this.appraisal_template.id,
        isApproved: false,
        isMandatory: this.newApproval.isMandatory,
      });
      this.appraisal_template.approvals.push({
        byID: this.newApproval.employee.id,
        by: this.newApproval.employee,
        isApproved: false,
        isMandatory: this.newApproval.isMandatory,
        appraisal_templateID: this.appraisal_template.id
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
      exclude: this.appraisal_template.approvals ? this.appraisal_template.approvals.map(dt => dt.byID) : [],
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
