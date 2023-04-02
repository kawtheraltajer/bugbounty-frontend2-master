import { Component, OnInit } from "@angular/core";
import { Case, Employee, payment, Session } from "src/app/interfaces/types";
import {
  Court,
  Company,
  CaseType,
  CourtRoom,
  Fees,
  Charge,
  ChargeType,
} from "./../../../interfaces/types";
import { SelectionModel } from "@angular/cdk/collections";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Input,
  OnChanges,
  ViewChild,
} from "@angular/core";
import { ModalController } from "@ionic/angular";
import {
  Permission,
  Role,
  User,
  Education,
  Client,
} from "src/app/interfaces/types";
import { AppService } from "src/app/services/app.service";
import { CourtService } from "src/app/services/court.service";
import { LanguageService } from "src/app/services/language.service";
import { AuthzService } from "src/app/services/authz.service";
import { ActivatedRoute, Router } from "@angular/router";
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";
import { PrintService } from "src/app/services/print.service";
import { DateAdapter } from "@angular/material/core";

import { FormControl } from "@angular/forms";
import { Alert, AlertPromise } from "selenium-webdriver";

@Component({
  selector: "case-requests-list",
  templateUrl: "./case-requests-list.component.html",
  styleUrls: ["./case-requests-list.component.scss"],
})
export class CaseRequestsListComponent implements OnInit {
  @Input("caseID") caseID: number;
  Requests: any;
  isAddBlock = false;
  @Input("FromFinance") FromFinance: Boolean;
  @Input("CaseID") CaseID: number;
  @Input("case") case: Case;
  @Input("isEdit") isEdit: boolean;
  @Input("isAdd") isAdd: boolean = false;
  RequestColumns: string[];
  @Input("selectedRequest") selectedRequest: Request[];
  RequestList = new MatTableDataSource([]);
  @Input("showSelected") showSelected: boolean;
  selection = new SelectionModel<Charge>(true, []);
  @ViewChild("RequestTablePaginator", { static: true })
  tablePaginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  isSearch = false;
  searchTerm = "";
  isEditMode: boolean;

  addForm;
  constructor(
    public Court: CourtService,
    fb: FormBuilder,
    public router: Router,
    public lang: LanguageService,
    public modalController: ModalController,
    public app: AppService,
    public court: CourtService,
    public authz: AuthzService,
    public print: PrintService
  ) {}

  async ngOnInit() {
    this.Requests = await this.court.getAllCaseRequests(this.caseID);
    await this.court.getRequests();
    this.isEditMode = false;
    this.RequestColumns = ["id", "Requests", "date", "comment", "Action"];
    this.getDisplayedColumns();
    this.RequestList = new MatTableDataSource(this.Requests);
    this.RequestList.paginator = this.tablePaginator;
  }

  getDisplayedColumns(): string[] {
    return this.app.isDesktop ? this.RequestColumns : this.RequestColumns;
  }

  async add() {
    const modal = await this.modalController.create({
      component: AddCaseRequest,
      cssClass: "responsiveModal",
      componentProps: { CaseID: this.caseID },
    });
    modal.onWillDismiss().then((data) => {
      this.ngOnInit();
    });
    return await modal.present();
  }

  async details(row) {
    const modal = await this.modalController.create({
      component: CaseRequestDetails,
      cssClass: "responsiveModal",
      componentProps: { CaseRequest: row },
    });
    modal.onWillDismiss().then((data) => {
      this.ngOnInit();
    });
    return await modal.present();
  }

  applyFilter() {
    //this.caseList.filterPredicate=null
    this.RequestList.filterPredicate = (data, filter) => {
      //console.log(data)
      return data.name.toLocaleLowerCase().includes(filter);
    };
    this.RequestList.filter = this.searchTerm.trim().toLowerCase();
  }

  async deleteCaseRequest(id) {
    let confirm = await this.app.presentConfirmAlert(
      "Operations.Confirm",
      "Court.Cases.Case-request.Errors.confirm_delete",
      "Operations.Cancel",
      "Operations.Confirm",
      true
    );
    if (confirm) {
      await this.court.deleteCaseRequest(id);
      this.ngOnInit();
    }
  }
}

@Component({
  selector: "add_caseRequest",
  templateUrl: "./add_caseRequest.html",
})
export class AddCaseRequest implements OnInit {
  @Input("CaseID") CaseID: number;
  isLoading = true;
  addForm: FormGroup;
  validation_messages: any;

  public RequestsCtrl: FormControl = new FormControl();
  public RequestFilterCtrl: FormControl = new FormControl();
  public filteredRequests: any[];
  requests: any

  constructor(
    private dateAdapter: DateAdapter<Date>,
    public modalCtrl: ModalController,
    public Court: CourtService,
    fb: FormBuilder,
    public router: Router,
    public lang: LanguageService,
    public modalController: ModalController,
    public app: AppService,
    public court: CourtService,
    public authz: AuthzService
  ) {
    this.addForm = fb.group({
      comments: [""],
      RequestID: ["", [Validators.required]],
      caseID: [""],
    });
  }

  async ngOnInit() {
    this.court.getRequests().then((r)=>{
      this.requests = r; 
      this.filteredRequests = r;
    });
    this.filteredRequests = this.requests;
    this.validation_messages = {
      RequestID: [
        {
          type: "required",
          message: "Court.Charge.massages.Charge_name.required",
        },
      ],
      caseID: [
        { type: "required", message: "Court.Charge.massages.Amounts.required" },
      ],
    };
  }

  async addCaseRequest() {
    await this.app.presentLoading();
    if (this.addForm.valid) {
      try {
        let requestData = this.addForm.value;
        console.log(requestData);
        let added = await this.Court.CreateCaseRequest({
          caseID: Number(this.CaseID),
          RequestID: requestData.RequestID,
          comments: requestData.comments,
        });
        await this.app.dismissLoading();
        this.addForm.reset();
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
      dismissed: true,
    });
  }

  public filterRequests(value) {
    return (this.filteredRequests = this.requests.filter((val) =>
        (val.name_ar.toLowerCase().includes(this.RequestFilterCtrl.value) || val.name_en.toLowerCase().includes(this.RequestFilterCtrl.value))
    ));
  }

  clearSelection() {
    this.filteredRequests = this.requests;
  }
}

@Component({
  selector: "caseRequest-details",
  templateUrl: "./caseRequest-details.html",
})
export class CaseRequestDetails implements OnInit {
  @Input("CaseRequest") CaseRequest: any;
  isLoading = true;
  addForm: FormGroup;
  validation_messages: any;

  constructor(
    private dateAdapter: DateAdapter<Date>,
    public modalCtrl: ModalController,
    public Court: CourtService,
    fb: FormBuilder,
    public router: Router,
    public lang: LanguageService,
    public modalController: ModalController,
    public app: AppService,
    public court: CourtService,
    public authz: AuthzService
  ) {
    this.addForm = fb.group({
      id: [""],
      comments: [""],
      RequestID: ["", [Validators.required]],
      caseID: [""],
    });
  }

  async ngOnInit() {
    await this.addForm.setValue({
      id: this.CaseRequest.id,
      comments: this.CaseRequest.comments,
      RequestID: this.CaseRequest.RequestID,
      caseID: this.CaseRequest.caseID,
    });
    this.validation_messages = {
      RequestID: [
        {
          type: "required",
          message: "Court.Charge.massages.Charge_name.required",
        },
      ],
      caseID: [
        { type: "required", message: "Court.Charge.massages.Amounts.required" },
      ],
    };
  }

  async addCaseRequest() {
    await this.app.presentLoading();
    if (this.addForm.valid) {
      try {
        let requestData = this.addForm.value;
        console.log(requestData);
        let added = await this.Court.UpdateCaseRequest({
          id: requestData.id,
          caseID: requestData.caseID,
          RequestID: requestData.RequestID,
          comments: requestData.comments,
        });
        await this.app.dismissLoading();
        this.addForm.reset();
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
      dismissed: true,
    });
  }
}
