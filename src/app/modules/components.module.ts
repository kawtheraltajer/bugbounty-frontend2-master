import { AddCaseRequest, CaseRequestDetails } from './../components/lists/case-requests-list/case-requests-list.component';
import { LogsListComponent, LogDetailModal } from './../components/lists/logs-list/logs-list.component';
import { ChargesTypeListComponent,UpdateChargesTypeModal } from '../components/lists/charges-type-list/charges-type-list.component';
import { DocumentListComponent,AddDocumentModal,UpdateDocumentModal } from './../components/lists/document-list/document-list.component';
import { ChargeDetailsModal } from './../components/lists/charges-list/charges-list.component';
import { FeesListComponent, LinkCaseToInvoice } from './../components/lists/fees-list/fees-list.component';
import { AddEmployeeLeave, EmployeeLeavesComponent } from './../components/lists/employee-leaves/employee-leaves.component';
import { AddBalance, LeaveBalanceComponent, UpdateBalance } from './../components/lists/leave-balance/leave-balance.component';
import { AddSessionModal, SessionDetailsModal, AddDelayReasonPage } from './../pages/court/session/session.page';
import { AddCaseCompanyModal, AddCompanyModal, CompanyDetailsModal } from './../pages/court/companies/companies.page';
import { AddClientModal, ClientDetailsModal } from './../pages/court/clients/clients.page';
import { TalentPage, ContractsPage, EmployeeLeavePage, AddEmployeeLeavePage, UpdateEmployeeLeavePage, EmployeeReportsPage ,BankInfonPage } from './../pages/employee-self-service/employee-self-service.page';
import { PersonalInformationPage } from '../pages/employee-self-service/employee-self-service.page';
import { AddLeavePage, UpdateLeavePage } from './../pages/hcm/workforce/leaves/dashbourd/dashbourd.page';
import { AddContractModal, ContractDetails, ContractsListComponent, UpdateContractModal } from './../components/lists/contracts-list/contracts-list.component';
import { VacancyListComponent, AddVacancyModal, VacancyDetailsModal, AddApplicationsModal, ApplicationDetailsModal, UpdateVacancyModal } from './../components/lists/vacancy-list/vacancy-list.component';
import { PersonalInformationComponent } from './../components/personal-information/personal-information/personal-information.component';
import { AddEmergencyContactModal, EmergencyContactComponent, UpdateEmergencyContactModal } from './../components/personal-information/emergency-contact/emergency-contact.component';
import { ContactComponent } from './../components/personal-information/contact/contact.component';
import { ContactListComponent } from './../components/lists/contact-list/contact-list.component';
import { AddressesListComponent, AddAddressesModal, UpdateAddressesModal } from './../components/lists/addresses-list/addresses-list.component';
import { CertificateListComponent, AddCertificateModal, UpdateCertificateModal } from './../components/lists/certificate-list/certificate-list.component';
import { ExperienceListComponent, AddExperienceModal, UpdateExperienceModal } from './../components/lists/experience-list/experience-list.component';
import { AddEducationModal, EducationListComponent, UpdateEducationModal } from './../components/lists/education-list/education-list.component';
import { EmployeeListComponent, EmployeeDetailsModal, AddEmployeeModal, UpdateDesignationModal } from '../components/lists/employee-list/employee-list.component';
import { AddRoleWizerdComponent } from './../components/add-role-wizerd/add-role-wizerd.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular'
import { MatModule } from './mat.module';
import { AddRoleModal, RoleDetailsModal, RolesListComponent } from '../components/lists/roles-list/roles-list.component';
import { TranslateModule } from '@ngx-translate/core';
import { AddGroupModal, GroupDetailsModal, GroupsListComponent } from '../components/lists/groups-list/groups-list.component';
import { AddPermissionModal, PermissionsListComponent } from '../components/lists/permissions-list/permission-list.component';
import { AddUserModal, ChangePasswordModal, UpdateRoleModal, UserDetailsModal, UsersListComponent } from '../components/lists/users-list/users-list.component';
import { LinkModalComponent } from '../components/link-modal/link-modal.component';
import { PipesModule } from './pipes.module';
import { TaskCardComponent } from '../components/task/task-card/task-card.component';
import { ColorPickerComponent } from '../components/pickers/color-picker/color-picker.component';
import { ColorPickerModule } from '@iplab/ngx-color-picker';
import { EmployeePickerComponent } from '../components/pickers/employee-picker/employee-picker.component';
import { AddTaskStatusComponent } from '../components/task/add-task-status/add-task-status.component';
import { AddTaskComponent } from '../components/task/add-task/add-task.component';
import { EditorModule } from '@tinymce/tinymce-angular';
import { AppointmentsListComponent } from '../components/schedule/appointments-list/appointments-list.component';
import { AddAppointmentTypeModal, AppointmentTypesListComponent, UpdateAppointmentTypeModal } from '../components/schedule/appointment-types-list/appointment-types-list.component';
import { AddTimeSlotModal, TimeSlotsListComponent } from '../components/schedule/time-slots-list/time-slots-list.component';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { DayViewComponentimplements } from '../components/schedule/day-view-scheduler/day-view-scheduler.component';
import { BookAppointmentComponent } from '../components/schedule/book-appointment/book-appointment.component';
import { MonthViewSchedulerComponent } from '../components/schedule/month-view-scheduler/month-view-scheduler.component';
import { AppointmentDetailsComponent } from '../components/schedule/appointment-details/appointment-details.component';
import { TimeSlotDetailsComponent } from '../components/schedule/time-slot-details/time-slot-details.component';
import { DirectivesModule } from './directives.module';
import { PermisstionPickerComponent } from '../components/pickers/permisstion-picker/permisstion-picker.component';
import { SiteBookingComponent } from '../components/schedule/site-booking/site-booking.component';
import { SiteVacancyComponent, AddApplicationSiteModal } from '../components/vacancy/site-vacancy/site-vacancy.component';
import { VtHeaderComponent } from '../components/vt-header/vt-header.component';
import { VtPageComponent } from '../components/vt-page/vt-page.component';
import { AddLeaveTypesPage, UpdateLeaveTypesPage } from '../pages/hcm/workforce/leaves/leave-types/leave-types.page';
import { VtNavComponent } from '../components/vt-nav/vt-nav.component';
import { AddTaxCodeModal, TaxCodeDetailsModal, TaxCodeListComponent, UpdateTaxCodeModal } from './../components/lists/tax-code-list/tax-code-list.component';
import { AddItemModal, ItemListComponent, ItemDetailsModal, UpdateItemModal } from '../components/lists/item-list/item-list.component';
import { AccountCodeDetailsModal, AccountCodeListComponent, AddAccountCodeModal, UpdateAccountCodeModal } from '../components/lists/account-code-list/account-code-list.component';
import { AccountTypeDetailsModal, AccountTypeListComponent, AddAccountTypeModal, UpdateAccountTypeModal } from '../components/lists/account-type-list/account-type-list.component';
import { AddExpenseModal, ExpenseListComponent, ExpenseDetailModal, UpdateExpenseModal, AddExpenseDetailModal, UpdateExpenseDetailModal } from '../components/lists/expense-list/expense-list.component';
import { InvoiceListComponent, AddInvoiceDetailModal, UpdateInvoiceModal, AddInvoiceModal, InvoiceDetailModal, UpdateInvoiceDetailModal } from '../components/lists/invoice-list/invoice-list.component';
//import { AddCaseModal, CaseDetailssModal } from './../components/lists/case-list/case-list.component';
import { ReceiptListComponent, ReceiptDetailModal, AddReceiptModal } from '../components/lists/receipt-list/receipt-list.component';
import { AccountTransectionDetailModal, AccountTransectionListComponent, AddAccountTransectionDetailModal, AddAccountTransectionModal } from '../components/lists/account-transection-list/account-transection-list.component';
import { AddHolidayPage, UpdateHolidayPage } from '../pages/hcm/workforce/leaves/holiday/holiday.page';
import { UpdateEmployeeLeave } from '../components/lists/employee-leaves/employee-leaves.component';
import { AddEmployeeBalance, BalancePage, UpdateEmployeeBalance, } from '../pages/hcm/workforce/leaves/balance/balance.page'; import { AddSupplierModal, SupplierDetailModal, SupplierListComponent, UpdateSupplierModal } from '../components/lists/supplier-list/supplier-list.component';
import { AddPLBSCategoryModal, PLBSCategoryDetailModal, PLBSCategoryListComponent, UpdatePLBSCategoryModal } from '../components/lists/plbs-category-list/plbs-category-list.component';
import { AddPLBSSubCategoryModal, PLBSSubCategoryDetailModal, PLBSSubCategoryListComponent, UpdatePLBSSubCategoryModal } from '../components/lists/plbs-sub-category-list/plbs-sub-category-list.component';
import { CustInvoiceDetailModal, CustInvoiceListComponent } from '../components/lists/cust-invoice-list/cust-invoice-list.component';
import { PayrollDetailModal, PayrollListComponent, ProcessPayrollModal } from '../components/lists/payroll-list/payroll-list.component';
import { UpdateCaseTypeModal } from '../pages/court/case-types/case-types.page';
import { UpdatedelayReasonModal } from '../pages/court/delay-reason/delay-reason.page';
import { UpdateRequestModal } from '../pages/court/requests/requests.page';
import { AddCharge, ChargesListComponent } from '../components/lists/charges-list/charges-list.component';
//import { CaseListComponent } from '../components/lists/case-list/case-list.component';
import { CaseTasksListComponent } from '../components/lists/case-tasks-list/case-tasks-list.component';
import { ReportListComponent } from '../components/lists/report-list/report-list.component';
import { ClaimsListComponent } from '../components/lists/claims-list/claims-list.component';
import { AddClaim } from '../components/lists/claims-list/claims-list.component';
import { CaseListComponent ,AddCaseModal, CaseDetailssModal, AddCaseTypesPage  } from '../components/lists/case-list/case-list.component';
//import { CaseListComponent ,AddCaseModal, CaseDetailssModal } from '../components/lists/case-list/case-list.component';
import { EmployeeSessionListComponent } from '../components/lists/employee-session-list/employee-session-list.component';
import { CaseRequestsListComponent } from '../components/lists/case-requests-list/case-requests-list.component';
import { PrintSessionsListComponent } from '../components/lists/print-sessions-list/print-sessions-list.component';
import { MySessionsListComponent } from '../components/lists/my-sessions-list/my-sessions-list.component';
import { AnnouncementComponent, AddAnnouncementModal, UpdateAnnouncementModal } from '../components/announcement/announcement.component';
import { NotificationListComponent } from '../components/lists/notification-list/notification-list.component';
import { AnnouncementListComponent } from '../components/announcement/announcement.component';
import { AppointmentDetailsModal, ChangeTimeSlotModal } from '../pages/schedule/appointments-table/appointments-table.page';
import { AddClientOrCompanyAppointment, AppointmentListComponent } from '../components/lists/appointment-list/appointment-list.component';
import { MatTableExporterModule } from 'mat-table-exporter';
import { FinanceNormalReportListComponent } from '../components/lists/finance-normal-report-list/finance-normal-report-list.component';
import { AddEmployeeRequestModal, EmployeeRequestsListComponent, RequestDetailsModal } from '../components/lists/employee-requests-list/employee-requests-list.component';
import { UpdateTypeModal } from '../pages/hcm/appraisal/types/types.page';
import { PrintTasksListComponent } from '../components/lists/print-tasks-list/print-tasks-list.component';
import { UpdateTaskModal } from '../pages/tasks/task-details/task-details.page';
//import { NgxDocViewerModule } from 'ngx-doc-viewer';


@NgModule({
        declarations: [
                LinkCaseToInvoice,
                RolesListComponent,
                RoleDetailsModal,
                AddRoleModal,
                GroupsListComponent,
                GroupDetailsModal,
                AddGroupModal,
                PermissionsListComponent,
                UsersListComponent,
                AddUserModal,
                UserDetailsModal,
                LinkModalComponent,
                AddPermissionModal,
                TaskCardComponent,
                ColorPickerComponent,
                EmployeePickerComponent,
                AddTaskStatusComponent,
                AddTaskComponent,
                AppointmentsListComponent,
                AppointmentTypesListComponent,
                TimeSlotsListComponent,
                AddTimeSlotModal,
                AddAppointmentTypeModal,
                DayViewComponentimplements,
                BookAppointmentComponent,
                MonthViewSchedulerComponent,
                AppointmentDetailsComponent,
                TimeSlotDetailsComponent,
                AddRoleWizerdComponent,
                PermisstionPickerComponent,
                EmployeeListComponent,
                EmployeeDetailsModal,
                AddEmployeeModal,
                EducationListComponent,
                ExperienceListComponent,
                CertificateListComponent,
                AddCertificateModal,
                AddExperienceModal,
                AddEducationModal,
                UpdateCertificateModal,
                UpdateEducationModal,
                UpdateExperienceModal,
                AddressesListComponent,
                AddAddressesModal,
                UpdateAddressesModal,
                ContactListComponent,
                ContactComponent,
                EmergencyContactComponent,
                AddEmergencyContactModal,
                UpdateEmergencyContactModal,
                PersonalInformationComponent,
                SiteBookingComponent,
                VacancyListComponent,
                AddVacancyModal,
                VacancyDetailsModal,
                AddApplicationsModal,
                ApplicationDetailsModal,
                UpdateVacancyModal,
                SiteVacancyComponent,
                AddApplicationSiteModal,
                ContractsListComponent,
                UpdateContractModal,
                AddContractModal,
                VtHeaderComponent,
                VtPageComponent,
                AddLeaveTypesPage,
                UpdateLeaveTypesPage,
                AddLeavePage,
                UpdateLeavePage,
                PersonalInformationPage,
                VtNavComponent,
                TalentPage,
                ContractsPage,
                EmployeeLeavePage,
                AddEmployeeLeavePage,
                TaxCodeListComponent,
                AddTaxCodeModal,
                UpdateTaxCodeModal,
                TaxCodeDetailsModal,
                ItemListComponent,
                AddItemModal,
                ItemDetailsModal,
                UpdateItemModal,
                AccountCodeListComponent,
                AddAccountCodeModal,
                AccountCodeDetailsModal,
                UpdateAccountCodeModal,
                AccountTypeListComponent,
                AddAccountTypeModal,
                AccountTypeDetailsModal,
                UpdateAccountTypeModal,
                ExpenseListComponent,
                AddExpenseModal,
                ExpenseDetailModal,
                UpdateExpenseModal,
                AddExpenseDetailModal,
                UpdateExpenseDetailModal,
                InvoiceListComponent,
                AddInvoiceModal,
                AddInvoiceDetailModal,
                InvoiceDetailModal,
                UpdateInvoiceModal,
                UpdateInvoiceDetailModal,
                ReceiptListComponent,
                ReceiptDetailModal,
                AddReceiptModal,
                AddClientModal,
                ClientDetailsModal,
                AddCompanyModal,
                CompanyDetailsModal,
                //AddCaseModal,
                //AddSessionModal,
                ContractDetails,
                AccountTransectionListComponent,
                AddAccountTransectionModal,
                AccountTransectionDetailModal,
                AddAccountTransectionDetailModal,
                LeaveBalanceComponent,
                AddBalance,
                UpdateBalance,
                AddHolidayPage,
                UpdateHolidayPage,
                UpdateEmployeeLeave,
                AddEmployeeLeave,
                EmployeeLeavesComponent,
                AddEmployeeBalance,
                UpdateEmployeeBalance,
                UpdateEmployeeLeavePage,
                UpdateAppointmentTypeModal,
                SupplierListComponent,
                AddSupplierModal,
                UpdateSupplierModal,
                SupplierDetailModal,
                PLBSCategoryListComponent,
                AddPLBSCategoryModal,
                UpdatePLBSCategoryModal,
                PLBSCategoryDetailModal,
                PLBSSubCategoryListComponent,
                AddPLBSSubCategoryModal,
                PLBSSubCategoryDetailModal,
                UpdatePLBSSubCategoryModal,
                CustInvoiceListComponent,
                CustInvoiceDetailModal,
                PayrollListComponent,
                PayrollDetailModal,
                ProcessPayrollModal,
                EmployeeReportsPage,
                FeesListComponent,
            
              UpdateCaseTypeModal,
              UpdatedelayReasonModal,
              UpdateRequestModal,
              ChargesListComponent,
              AddCharge,
              AddCaseModal,
              CaseDetailssModal ,
              AddSessionModal,
              AddCaseCompanyModal  ,
              CaseTasksListComponent,
              AddSessionModal,
              ChargeDetailsModal,
              SessionDetailsModal,
              ReportListComponent,
              DocumentListComponent,
              AddDocumentModal,
              UpdateDocumentModal,
              ClaimsListComponent,
              AddClaim,
              CaseListComponent,
              ChargesTypeListComponent,
              UpdateChargesTypeModal,
              EmployeeSessionListComponent,
              AddDelayReasonPage,
              AddCaseTypesPage,
              CaseRequestsListComponent,
              AddCaseRequest,
              CaseRequestDetails,
              PrintSessionsListComponent,
              MySessionsListComponent,
              AnnouncementComponent,
              AddAnnouncementModal,
              NotificationListComponent,
              AnnouncementListComponent,
              UpdateAnnouncementModal,
              AppointmentDetailsModal,
              AppointmentListComponent,
              ChangeTimeSlotModal,
              LogsListComponent,
              LogDetailModal,
              FinanceNormalReportListComponent,
              EmployeeRequestsListComponent,
              AddEmployeeRequestModal,
              RequestDetailsModal,
              ClientDetailsModal,
              UpdateTypeModal,
              CompanyDetailsModal,
              PrintTasksListComponent,
              UpdateTaskModal,
              ChangePasswordModal,
              UpdateRoleModal,
              UpdateDesignationModal,
              AddClientOrCompanyAppointment,
              BankInfonPage
              

        ],
        exports: [
                LinkCaseToInvoice,
                RolesListComponent,
                RoleDetailsModal,
                AddRoleModal,
                GroupsListComponent,
                GroupDetailsModal,
                AddGroupModal,
                PermissionsListComponent,
                UsersListComponent,
                AddUserModal,
                UserDetailsModal,
                LinkModalComponent,
                AddPermissionModal,
                TaskCardComponent,
                ColorPickerComponent,
                EmployeePickerComponent,
                AddTaskStatusComponent,
                AddTaskComponent,
                AppointmentsListComponent,
                AppointmentTypesListComponent,
                TimeSlotsListComponent,
                AddTimeSlotModal,
                AddAppointmentTypeModal,
                DayViewComponentimplements,
                BookAppointmentComponent,
                MonthViewSchedulerComponent,
                AppointmentDetailsComponent,
                TimeSlotDetailsComponent,
                AddRoleWizerdComponent,
                PermisstionPickerComponent,
                EmployeeListComponent,
                AddEmployeeModal,
                EducationListComponent,
                ExperienceListComponent,
                CertificateListComponent,
                AddCertificateModal,
                AddExperienceModal,
                AddEducationModal,
                UpdateCertificateModal,
                UpdateEducationModal,
                UpdateExperienceModal,
                AddressesListComponent,
                AddAddressesModal,
                UpdateAddressesModal,
                ContactListComponent,
                ContactComponent,
                EmergencyContactComponent,
                AddEmergencyContactModal,
                UpdateEmergencyContactModal,
                SiteBookingComponent,
                PersonalInformationComponent,
                VacancyListComponent,
                AddVacancyModal,
                VacancyDetailsModal,
                AddApplicationsModal,
                ApplicationDetailsModal,
                UpdateVacancyModal,
                SiteVacancyComponent,
                AddApplicationSiteModal,
                ContractsListComponent,
                UpdateContractModal,
                AddContractModal,
                VtHeaderComponent,
                VtPageComponent,
                AddLeaveTypesPage,
                UpdateLeaveTypesPage,
                AddLeavePage,
                UpdateLeavePage,
                PersonalInformationPage,
                VtNavComponent,
                TalentPage,
                ContractsPage,
                EmployeeLeavePage,
                AddEmployeeLeavePage,
                TaxCodeListComponent,
                AddTaxCodeModal,
                UpdateTaxCodeModal,
                TaxCodeDetailsModal,
                ItemListComponent,
                AddItemModal,
                ItemDetailsModal,
                UpdateItemModal,
                AccountCodeListComponent,
                AddAccountCodeModal,
                AccountCodeDetailsModal,
                UpdateAccountCodeModal,
                AccountTypeListComponent,
                AddAccountTypeModal,
                AccountTypeDetailsModal,
                UpdateAccountTypeModal,
                ExpenseListComponent,
                AddExpenseModal,
                ExpenseDetailModal,
                UpdateExpenseModal,
                AddExpenseDetailModal,
                UpdateExpenseDetailModal,
                InvoiceListComponent,
                AddInvoiceModal,
                AddInvoiceDetailModal,
                InvoiceDetailModal,
                UpdateInvoiceModal,
                UpdateInvoiceDetailModal,
                ReceiptListComponent,
                ReceiptDetailModal,
                AddReceiptModal,
                AddClientModal,
                ClientDetailsModal,
                AddCompanyModal,
                CompanyDetailsModal,
                AddCaseModal,

                AddSessionModal,
                ContractDetails,
                AccountTransectionListComponent,
                AddAccountTransectionModal,
                AccountTransectionDetailModal,
                AddAccountTransectionDetailModal,
                LeaveBalanceComponent,
                AddBalance,
                UpdateBalance,
                AddHolidayPage,
                UpdateHolidayPage,
                UpdateEmployeeLeave,
                AddEmployeeLeave,
                EmployeeListComponent,
                EmployeeLeavesComponent,
                AddEmployeeBalance,
                UpdateEmployeeBalance,
                UpdateEmployeeLeavePage,
                UpdateAppointmentTypeModal,
                SupplierListComponent,
                AddSupplierModal,
                UpdateSupplierModal,
                SupplierDetailModal,
                PLBSCategoryListComponent,
                AddPLBSCategoryModal,
                UpdatePLBSCategoryModal,
                PLBSCategoryDetailModal,
                PLBSSubCategoryListComponent,
                AddPLBSSubCategoryModal,
                PLBSSubCategoryDetailModal,
                UpdatePLBSSubCategoryModal,
                CustInvoiceListComponent,
                CustInvoiceDetailModal,
                PayrollListComponent,
                PayrollDetailModal,
                ProcessPayrollModal,
                EmployeeReportsPage,
                FeesListComponent,
          
                UpdateCaseTypeModal,
                UpdatedelayReasonModal,
                UpdateRequestModal,
                ChargesListComponent,
                AddCharge,
                CaseListComponent,
                AddCaseModal,
                CaseDetailssModal,
                //AddSessionModal,
                AddCaseCompanyModal,
                //AddSessionModal,
                ChargeDetailsModal,
               SessionDetailsModal,
               ReportListComponent,
               DocumentListComponent,
               AddDocumentModal,
               UpdateDocumentModal,
               ClaimsListComponent,
               AddClaim,
               ChargesTypeListComponent,
               UpdateChargesTypeModal,
               EmployeeSessionListComponent,
               AddDelayReasonPage,
               AddCaseTypesPage,
               CaseRequestsListComponent,
               AddCaseRequest,
               CaseRequestDetails,
               PrintSessionsListComponent,
               MySessionsListComponent,
               AnnouncementComponent,
               AddAnnouncementModal,
               NotificationListComponent,
               AnnouncementListComponent,
               UpdateAnnouncementModal,
               AppointmentDetailsModal,
               AppointmentListComponent,
               ChangeTimeSlotModal,
               LogsListComponent,
               //LogDetailModal
               LogDetailModal,
               FinanceNormalReportListComponent,
               EmployeeRequestsListComponent,
               AddEmployeeRequestModal,
               RequestDetailsModal,
               ClientDetailsModal,
               UpdateTypeModal,
               CompanyDetailsModal,
               PrintTasksListComponent,    
               UpdateTaskModal,
               ChangePasswordModal,
               UpdateRoleModal,
               UpdateDesignationModal,
               AddClientOrCompanyAppointment,
               BankInfonPage
               

        ],
        imports: [
                CommonModule,
                FormsModule,
                MatModule,
                ColorPickerModule,
                IonicModule,
                DirectivesModule,
                NgxMaterialTimepickerModule,
                TranslateModule,
                EditorModule,
                PipesModule,
                MatTableExporterModule





        ]
})
export class ComponentsModule { }