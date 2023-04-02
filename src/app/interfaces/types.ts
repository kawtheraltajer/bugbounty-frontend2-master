
import { DateTime } from 'luxon';
export type UserSettings = {
    id?: number
    details?: any
    userID?: number
}

export type AppSettings = {
    id?: number
    details?: any
}
export type Counter = {
    name?: string
    code?: string
    amount?: number
}



export type User = {
    id?: number
    email?: string
    first_name?: string
    middle_name?: string
    last_name?: string
    bio?: string
    pictureURL?: string
    password?: string
    createdAt?: Date
    isActive?: boolean
    isLocked?: boolean
    loginAttemp?: number
    refreshToken_version?: number
    roleID?: number
    role?: Role
    employee?: Employee
    client?: Client
    logs?: Log[],
    Leave_balance: Leave_balance[]
    notifications?: Notification[]
    userSettings?: UserSettings
    selected?: boolean
}

export type Employee = {
    id?: number
    user?: User
    userID?: number
    supervisee?: Employee[]
    supervisor?: Employee
    supervisorID?: number
    groups?: EmployeeToGroup[]
    representCases?: Case[]
    tasks?: Task[]
    leaves?: Leave[]
    groupLeader?: Group[]
    timeSlots?: TimeSlot[]
    education?: Education[]
    experiences?: Experience[]
    certificates?: Certificate[]
    penalties?: Penalty[]
    designation?: Designation
    designationID?: number
    leaves_balance?: number
    join_date?: Date
    last_date?: Date
    employee_contracts?: EmployeeContract[]
    employment_status?: EmploymentStatus
    department?: Department
    departmentID?: number
    subDepartment?: SubDepartment
    subDepartmentID?: number
    imbursements?: Imbursement[]
    personal_information?: PersonalInformation
    personalInformationID?: number
    myAppraisals?: Appraisal[]
    appraisee?: Appraisal[]
    appraisal_approval?: AppraisalApproval[]
    isNotary?: boolean
    created_vacancies?: Vacancy[]
    manage_departments?: Department[]
    Leave_balance?: Leave_balance[]
    selected?: boolean
}

export type AppraisalTemplate = {
    id?: number
    title_ar?: string
    title_en?: string
    type?: AppraisalType
    typeID?: number
    designations?: Designation[]
    approvals?: AppraisalApproval[]
    sections?: AppraisalSection[]
}

// ! Appraisal -------------
export type Appraisal = {
    id?: number
    template_title?: string
    year?: number
    month?: number
    sections?: AppraisalSection[]
    status?: AppraisalStatus
    type?: AppraisalType
    typeID?: number
    employee?: Employee
    employeeID?: number
    appraiser?: Employee
    appraiserID?: number
    approvals?: AppraisalApproval[]
    isApproved?: Boolean
    overall_score?: number
    overall_weightage?: number
    complete_percentage?: number
    isLocked?: boolean
    createdAt?: Date
    updatedAt?: Date
}

export type AppraisalSection = {
    id?: number
    index?: number
    isTemplate?: boolean
    title?: string
    description?: string
    type?: AppraisalSectionType
    total_score?: number
    total_weightage?: number
    blocks?: SectionBlock[]
    appraisal?: Appraisal
    appraisalID?: number
    appraisal_template?: AppraisalTemplate
    appraisal_templateID?: number
    comments?: Comment[]
    expanded?: boolean
}

export type SectionBlock = {
    id?: number
    title?: string
    description?: string
    section?: AppraisalSection
    sectionID?: number
    index?: number

    isTemplate?: boolean


    // GradedBlock
    weightage?: number
    score?: number
    rate?: number
    // ObjectiveBlock
    target_date?: Date
    completion_date?: Date
    completion_percentage?: number
    employee_comment?: string

    // Feedback
    answer?: string
    question?: string
}
export type AppraisalApproval = {
    id?: number
    appraisal?: Appraisal
    appraisalID?: number
    by?: Employee
    byID?: number
    isMandatory?: boolean
    isApproved?: boolean
    appraisal_template?: AppraisalTemplate
    appraisal_templateID?: number
}
export type AppraisalType = {
    id?: number
    title_en?: string
    title_ar?: string
    appraisals?: Appraisal[]
    appraisal_templates?: AppraisalTemplate[]
    selected?: boolean
}

export const AppraisalStatusEnum = {
    CreationPhase: 'CreationPhase',
    EvaluationPhase: 'EvaluationPhase',
    ApprovalPhase: 'ApprovalPhase',
    FeedbackPhase: 'FeedbackPhase',
    Completed: 'Completed',
    Archived: 'Archived'
};
export type AppraisalStatus = keyof typeof AppraisalStatusEnum

export const AppraisalSectionTypeEnum = {
    OutOF100: 'OutOF100',
    OutOF5: 'OutOF5',
    PassFail: 'PassFail',
    Feedback: 'Feedback',
    Objective: 'Objective',
};
export type AppraisalSectionType = keyof typeof AppraisalSectionTypeEnum
// ! -------------------------


// ! Employee ------------------------------
export type Designation = {
    id?: number
    title_en?: string
    title_ar?: string
    employees?: Employee[]
    default_appraisal?: Appraisal
    default_appraisalID?: number
}
export type EmployeeContract = {
    id?: number
    isCurrent?: boolean
    employeeID?: number
    title_ar?: string
    title_en?: string
    basic_salary?: number
    jobType?: JobType
    salary?: number
    payroll_group?: PayrollGroup
    startDate?: Date
    endDate?: Date
    allowances?: Allowance[]
    deductions?: Deduction[]
    bonuses?: Bonus[]


}
export type PersonalInformation = {
    id?: number
    gender?: Gender
    marital_status?: MaritalStatus
    nationality?: string
    national_identity?: number
    religion?: string
    passport?: number
    birth_date?: Date
    cpr_front?: string
    cpr_back?: string
    documents?: Document[]
    addresses?: Address[]
    emergency_contacts?: EmergencyContact[]
    contact?: Contact
    bank_account?: BankAccount
    bank_accountID?: number,
}

export type Address = {
    id?: number
    isMain?: boolean
    line1?: string
    line2?: string
    city?: string
    country?: string
    latitude?: number
    longitude?: number
    clientID?: number
    personalInformation?: PersonalInformation
    personalInformationID?: number
}

export type EmergencyContact = {
    id?: number
    name?: string
    relation?: RelationType
    email?: string
    phone?: number
    mobile?: number
    personalInformation?: PersonalInformation
    personalInformationID?: number
}

export type Client = {
    id?: number
    full_name?: string
    CPR?: number
    email?: string
    mobile1?: number
    mobile2?: number
    Address?: string
    nationality?: string
    whatsApp_phone?: number
    type?: ClientType
    appointments?: Appointment[]
    job_position?: string
    comments?: string
    cases?: Case[]
    user?: User
    userID?: number
    documents?: Document[]
    Last_updated?: Date
    Last_updated_User?: string
}
export type Company = {
    id?: number
    full_name?: string
    CR?: number
    email?: string
    mobile1?: number
    mobile2?: number
    whatsApp_phone?: number
    type?: ClientType
    appointments?: Appointment[]
    comments?: string
    cases?: Case[]
    user?: User
    userID?: number
    documents?: Document[]
    Last_updated?: Date
    Last_updated_User?: string
}
export type Contact = {
    id?: number
    phone?: number
    email?: string
    mobile?: number
    personalInformation?: PersonalInformation
    personalInformationID?: number
}
export type BankAccount = {
    id?: number
    isDefault?: boolean
    bank_name?: string
    holder_name?: string
    account_number?: number
    IBAN?: string
}

export type Penalty = {
    id?: number
    employee?: Employee
    employeeID?: number
    penalty_name?: string
}

export type Education = {
    id?: number
    employee?: Employee
    employeeID?: number
    place?: string
    result?: string
    duration?: string
    type?: EducationType
}

export type Certificate = {
    id?: number
    employee?: Employee
    employeeID?: number
    title?: string
    issuer?: string
    issue_date?: Date
}

export type Experience = {
    id?: number
    employeeID?: number
    company?: string
    position?: string
    address?: string
    duration?: string
}

//   ! Payment ------------------------------
export type JobResponsibility = {
    id?: number
    title_ar?: string
    title_en?: string
}

export type ContractTemplate = {
    id?: number
    title_ar?: string
    title_en?: string
    contractDetails?: any
}

export type Allowance = {
    id?: number
    title_en?: string
    title_ar?: string
    description?: string
    amount?: number
    employeeContractId?: number
}

export type Bonus = {
    id?: number
    title_en?: string
    title_ar?: string
    description?: string
    amount?: number
    employeeContractId?: number
}
export type Deduction = {
    id?: number
    title_en?: string
    title_ar?: string
    description?: string
    type?: DeductionType
    calculationType?: CalculationType
    amount?: number
    employeeContractId?: number
}

export type Imbursement = {
    id?: number
    month?: number
    year?: number
    title?: string
    description?: string
    amount?: number
    employeeID?: number
}
export type PaySlip = {
    id?: number
    contractID?: number
    month?: number
    year?: number
    custom_fields?: any
    allowed_leaves?: number
    taken_leaves?: number
    working_days?: number
    payslip_details?: any
    total_allowences?: number
    gosi_contribution?: number
    total_deductions?: number
    total_bonuses?: number
    total_gross?: number
    net_amount?: number
    status?: PaySlipStatus
    payment_status?: PaymentStatus
    payment_type?: PaymentType
    paidAt?: Date
    generatedAt?: Date
}

// ! Orgenization ------------------------- 
export type Department = {
    id?: number
    name_ar?: string
    name_en?: string
}
export type SubDepartment = {
    id?: number
    name_ar?: string
    name_en?: string
    departmentID?: number
}

// ! Court --------------------------------
export type Case = {
    id?: number
    clientID?: number
    client?: Client
    companyID?: number
    company?: Company
    reference_no?: string
    internalFile_no?: string
    status?: CaseStatus
    type?: CaseType
    comment?: string
    courtID?: number
    courtRoomID?: number
    sessions?: Session[]
    tasks?: Task[]
    documents?: Document[]
    representativeID?: number
    representative?: Employee
    court?: Court
    courtRoom?: CourtRoom
    claims?: Claim
    fees?: Fees
    charge?: Charge[]
    opponent?: Opponent
    typeID?: number
    caseRepresentative?: string
    JudgedAt?: Date
    Adjudge?: string
    CaseNo?: string
    RelationType?: string
    last_sesstion_date?: Date
    Last_updated?: Date
    Last_updated_User?: string
}
export type Fees = {

    id: number
    caseId: number
    customerID: number
    case: Case
    clientID: number
    client: Client
    companyID: number
    Company: Company
    Payment: payment
    balance: number
    total_fees: number
    total_paid: number
    due_date: Date

}
export type Charge = {
    id: number
    caseId: number
    case: Case
    Amounts: number
    Comments: string
    status: String
    Name: String
    CPR: number
    Date: DateTime
    reference_no: String
    ChargeTypeID: number
    ChargeType: ChargeType
    recipient_name:String
    Last_updated?: Date
    Last_updated_User?: string
}
export type ChargeType = {
    id: number
    name_ar?: string
    name_en?: string
    amount?:number
    Last_updated?: Date
    Last_updated_User?: string
}


export type payment = {
    id: number
    received_from: string
    amount: number
    method: string
    chegue_date: Date
    chegue_no: number
    drown_on: string
    comment: string
    due_date: Date
    Fees?: Fees
    FeesID: number
    Charge?: Charge
    ChargeID: number
    ClimsID?: number
    total?: number
    balance?: number
    paymentReceiptNo?: string
}
export type Claim = {
    id?: number
    type?: ClaimType
    caseID?: number
    case?: Case
    details?: string
    date?: Date
    approval?: boolean
    Payment: payment
    customerID: number
    balance?: number
    total: number
    total_paid: number
    due_date: Date
    discount: number
}
export type Opponent = {
    id?: number
    name?: string
    cpr?: number
    main_mobile?: number
    secondry_mobile?: number
    nationality?: string
    email?: string
    organization?: string
    addressID?: number
    address?: Address
    case?: Case
    caseID?: number
}
export type Session = {
    id?: number
    reference_no?: string
    session_no?: number
    caseID?: number
    delay_reason?: string
    delay_details?: string
    status?: SessionStatus
    comment?: string
    case?: Case
    documents?: Document[]
    representative: Employee
    representativeID: number
    DelayReson: DelayReson
    delayrResonID: number
}
export type Court = {
    id?: number
    name?: string
    location?: JSON
}
export type CourtRoom = {
    id?: number
    number?: number
    title?: string
    courtID?: number
}


// ! Task --------------------------------
export type TaskComment = {
    userID?: number
    userName?: string
    userEmail?: string
    userIMG?: string
    body?: string
    createdAt?: Date
}
export type TaskStatus = {
    id?: number
    index?: number
    name_ar?: string
    name_en?: string
    color?: string
    isHidden?: boolean
    isChangesLocked?: boolean
    tasks?: Task[]
    group?: Group
    groupID?: number
}
export type Task = {
    id?: number
    title?: string
    details?: string
    employeeID?: number
    employee?: Employee
    createdAt?: Date
    updatedAt?: Date
    dueDate?: Date
    comments?: { comments: TaskComment[] }
    statusID?: number
    status?: TaskStatus
    caseID?: number
    case?: Case
    index?: number
    createdBy?: Employee
    createdByID?: number
}

// ! System ------------------------------
export type Group = {
    id?: number
    name?: string
    description?: string
    leaderID?: number
    leader?: Employee
    members?: EmployeeToGroup[]
    taskStatuses?: TaskStatus[]

}
export type EmployeeToGroup = {

    id?: number
    Employee: Employee[]
    employeeID?: number
    groupID?: number
    Group?: Group[]

}
export type Permission = {
    id?: number
    name?: string
    description?: string
    auth_field?: string
    view_fields?: JSON
    subject?: Subject
    action?: Action
    module?: Module
    role?: Role[]
    selected?: boolean
}
export type Role = {
    id?: number
    name?: string
    description?: string
    users?: User[]
    groups?: Group[]
    permissions?: Permission[]
}
export type Log = {
    id?: number
    description?: string
    details?: any
    type?: LogType
    userId?: number
    user?: User
    createdAt?: Date
}
export type Document = {
    id?: number
    name?: string
    Type?: FileType
    url?: string
    caseID?: number
    sessionID?: number
    case?: Case
    session?: Session
    createdAt?: Date
    file_type?: FileType
    document_type?: DocumentType
    metadata?: any
    description?: string
    personalInformationId?: number
    leaveId?: number
}
export type Notification = {
    id?: number
    receiver?: User
    receiverID?: number
    sender?: any
    topic?: NotificationsTopic
    isRead?: boolean
    isHidden?: boolean
    createdAt?: Date
    body?: string
}
export type Comment = {
    id?: number
    createdAt?: Date
    createdBy?: Employee
    createdByID?: number
    section?: AppraisalSection
    sectionID?: number
}


// ! Time  -------------------------------
export type TimeSlot = {
    id?: number
    createdAt?: Date | string
    employee?: Employee
    employeeID?: number
    startTime?: Date | string
    endTime?: Date | string
    date?: Date | string
    appointment?: Appointment
    appointmentID?: number
    isApproved?: boolean
    isBooked?: boolean
}
export type Appointment = {
    id?: number
    type?: AppointmentType
    typeID?: number
    client?: Client
    clientID?: number
    company?: Company
    companyID?: number
    client_name?: string
    client_type?: ClientType
    isExtended?: boolean
    client_cpr?: string
    client_cr?: string
    client_email?: string
    client_phone?: string
    case_description?: string
    timeSlot?: TimeSlot[]
    timeSlot_history?: {
        timeSlot: TimeSlot[]
    }
    canceled?: boolean
    cancellation_reson?: string
    notes?: string
    documents?: Document[]
    CprUrl?: string,
    OtherUrl?: string,
    completed?: boolean

}
export type AppointmentType = {
    id?: number
    title_en?: string
    title_ar?: string
    color?: string
    isNotary?: boolean
    Booking?: Appointment[]
}
export type Leave = {
    id?: number
    employeeID?: number
    leaveTypeID?: number
    approval?: boolean
    from_date?: Date
    to_date?: Date
    total_days?: number,
    type: LeaveType,
    status: LeaveStatus
    documentURL: string


}

export type LeaveStatus = keyof typeof LeaveStatusEnum


export const LeaveStatusEnum = {
    Pendding: 'Pendding',
    Approved: 'Approved',
    Reject: 'Reject'

};

export type LeaveType = {
    id?: number
    name_ar?: string
    name_en?: string
    allowed_per_year?: number
    allowed_once?: boolean
    paid?: boolean,
    details?: any

}



export type Holiday = {
    id?: number,
    name_ar?: string,
    name_en?: string,
    date?: Date,

    year?: Date
}


// ! Enums -------------------------------

export const EmploymentStatusEnum = {
    Training: 'Training',
    Employed: 'Employed',
    NoticePeriod: 'NoticePeriod',
    Suspended: 'Suspended',
    Dismissed: 'Dismissed'
};

export type EmploymentStatus = keyof typeof EmploymentStatusEnum


export const NotificationsTopicEnum = {
    TaskAssignment: 'TaskAssignment',
    TaskComments: 'TaskComments',
    LeaveCancelation: 'LeaveCancelation',
    LeaveApproval: 'LeaveApproval',
    LeaveDeclined: 'LeaveDeclined',
    LeaveRequest: 'LeaveRequest',
    Other: 'Other'
};

export type NotificationsTopic = keyof typeof NotificationsTopicEnum


export const GenderEnum = {
    Male: 'Male',
    Female: 'Female'
};

export type Gender = keyof typeof GenderEnum


export const MaritalStatusEnum = {
    Single: 'Single',
    Married: 'Married',
    Divorced: 'Divorced',
    Widowed: 'Widowed'
};


export type MaritalStatus = keyof typeof MaritalStatusEnum


export const RelationTypeEnum = {
    Husband: 'Husband',
    Wife: 'Wife',
    Father: 'Father',
    Mother: 'Mother',
    Brother: 'Brother',
    Son: 'Son',
    Uncle: 'Uncle',
    Other: 'Other'
};

export type RelationType = keyof typeof RelationTypeEnum


export const ClientTypeEnum = {
    Company: 'Company',
    Individual: 'Individual'
};

export type ClientType = keyof typeof ClientTypeEnum


export const FileTypeEnum = {
    Image: 'Image',
    Audio: 'Audio',
    PDF: 'PDF',
    DOC: 'DOC',
    XLXS: 'XLXS',
    Other: 'Other'
};

export type FileType = keyof typeof FileTypeEnum


export const DocumentTypeEnum = {
    CPRFront: 'CPRFront',
    CPRBack: 'CPRBack',
    Passport: 'Passport',
    License: 'License',
    CR: 'CR',
    ExperienceLetter: 'ExperienceLetter',
    ProfessionalCertificate: 'ProfessionalCertificate',
    EducationCertificate: 'EducationCertificate',
    PaySlip: 'PaySlip',
    Award: 'Award',
    BankAccount: 'BankAccount',
    Case: 'Case',
    Session: 'Session',
    Other: 'Other',
    memoir: 'memoir',
    Documents: 'Documents',
    Adjudge_attachment: 'Adjudge_attachment',
    Lawsuit_attachment: 'Lawsuit_attachment',
    CPR: 'CPR',
    Advice_form: 'Advice_form',
    Know_your_client_form: 'Know_your_client_form',
    Consultations: 'Consultations'
};

export type DocumentType = keyof typeof DocumentTypeEnum


export const CaseStatusEnum = {
    OnGoing: 'OnGoing',
    CLOSED: 'CLOSED'
};

export type CaseStatus = keyof typeof CaseStatusEnum




export const SessionStatusEnum = {
    UPCOMING: 'UPCOMING',
    DELAYED: 'DELAYED',
    FINISHED: 'FINISHED'
};

export type SessionStatus = keyof typeof SessionStatusEnum


export const JobTypeEnum = {
    FullTime: 'FullTime',
    PartTime: 'PartTime',
    Freelance: 'Freelance',
    Intern: 'Intern'
};

export type JobType = keyof typeof JobTypeEnum


export const PayrollGroupEnum = {
    Yearly: 'Yearly',
    Monthly: 'Monthly',
    Quarterly: 'Quarterly',
    Daily: 'Daily'
};

export type PayrollGroup = keyof typeof PayrollGroupEnum


export const DeductionTypeEnum = {
    preTax: 'preTax',
    postTax: 'postTax'
};

export type DeductionType = keyof typeof DeductionTypeEnum


export const CalculationTypeEnum = {
    Flat: 'Flat',
    Percentage: 'Percentage'
};

export type CalculationType = keyof typeof CalculationTypeEnum


export const PaySlipStatusEnum = {
    Process: 'Process',
    Cleared: 'Cleared'
};

export type PaySlipStatus = keyof typeof PaySlipStatusEnum


export const PaymentStatusEnum = {
    UnPaid: 'UnPaid',
    Paid: 'Paid'
};

export type PaymentStatus = keyof typeof PaymentStatusEnum


export const PaymentTypeEnum = {
    Cash: 'Cash',
    BankTransfer: 'BankTransfer',
    Cheque: 'Cheque'
};

export type PaymentType = keyof typeof PaymentTypeEnum


export const EducationTypeEnum = {
    University: 'University',
    SecondarySchool: 'SecondarySchool'
};

export type EducationType = keyof typeof EducationTypeEnum


export const ClaimTypeEnum = {
    REFUND: 'REFUND',
    STAISTIONARY: 'STAISTIONARY'
};

export type ClaimType = keyof typeof ClaimTypeEnum


export const SubjectEnum = {
    User: 'User',
    AccountType: 'AccountType',
    Address: 'Address',
    AdminAccess: 'AdminAccess',
    AdminSupportAccess: 'AdminSupportAccess',
    auditorAccess: 'auditorAccess',
    Announcement: 'Announcement',
    Appointment: 'Appointment',
    AppointmentType: 'AppointmentType',
    Appraisal: "Appraisal",
    AvailableHours: 'AvailableHours',
    Case: 'Case',
    CaseType: 'CaseType',
    Case_Request: 'Case_Request',
    Charge: 'Charge',
    ChargeType: 'ChargeType',
    Claim: 'Claim',
    Client: 'Client',
    ClientAccess: 'ClientAccess',
    Company: 'Company',
    CompanyAccess: 'CompanyAccess',
    Court: 'Court',
    CourtRoom: 'CourtRoom',
    Dashboard: 'Dashboard',
    DelayReson: 'DelayReson',
    Document: 'Document',
    Employee: 'Employee',
    EmployeeContract: 'EmployeeContract',
    EmployeeRequest: 'EmployeeRequest',
    Expense: 'Expense',
    Fees: 'Fees',
    Finance: 'Finance',
    Group: 'Group',
    Holiday: 'Holiday',
    Invoice: 'Invoice',
    Item: 'Item',
    LawyerAccess: 'LawyerAccess',
    Leave: 'Leave',
    LeaveType: 'LeaveType',
    Leave_balance: 'Leave_balance',
    Log: 'Log',
    Opponent: 'Opponent',
    payment: "payment",
    PaySlip: 'PaySlip',
    Permission: 'Permission',
    Receipt: 'Receipt',
    Request: 'Request',
    Role: 'Role',
    Session: 'Session',
    SLawyerAccess: 'SLawyerAccess',
    SuperAdminAccess: 'SuperAdminAccess',
    Supplier: 'Supplier',
    Task: 'Task',
    TaskStatus: 'TaskStatus',
    TimeSlot: 'TimeSlot',
    Tax: 'Tax',
    Vacancy: 'Vacancy'
};

export type Subject = keyof typeof SubjectEnum


export const ActionEnum = {
    CREATE: 'CREATE',
    DELETE: 'DELETE',
    UPDATE: 'UPDATE',
    READ: 'READ',
    REPORT: 'REPORT',
    PRINT: 'PRINT',
    MANAGE: 'MANAGE'
};

export type Action = keyof typeof ActionEnum;


export const ModuleEnum = {
    HR: 'HR',
    STORAGE: 'STORAGE',
    COURT: 'COURT',
    SYSTEM: 'SYSTEM'
};

export type Module = keyof typeof ModuleEnum


export const LogTypeEnum = {
    ERROR: 'ERROR',
    EMAIL: 'EMAIL',
    SUCCESS: 'SUCCESS',
    CRUD: 'CRUD'
};

export type LogType = keyof typeof LogTypeEnum


// ! Recruitment -------------
export type Vacancy = {
    id?: number
    number_of_openings?: number
    code?: string
    coverURL?: string
    tags?: string
    description?: string
    position?: string
    location?: string
    type?: VacancyType
    status?: VacancyStatus
    openingAt?: Date
    closingAt?: Date
    createdAt?: Date
    education_level?: string
    createdByID?: number
    departmentID?: number
    applications?: VacancyApplication[]
    department?: Department
}

/**
 * Model VacancyApplication
 */

export type VacancyApplication = {
    id?: number
    status?: VacancyApplicationStatus
    applicant_first_name?: string
    applicant_last_name?: string
    applicant_email?: string
    applicant_phone?: string
    documentURL?: string
    highest_qualification?: CertificateType
    isCurrentlyEmployed?: boolean
    recent_job_role?: string
    applicant_summry?: string
    comments?: any
    vacancyID?: number
}


export const VacancyTypeEnum = {
    FullTime: 'FullTime',
    PartTime: 'PartTime',
    Intern: 'Intern'
};
export type VacancyType = keyof typeof VacancyTypeEnum
// ! -------------------------


export const VacancyStatusEnum = {
    Pending: 'Pending',
    Open: 'Open',
    Closed: 'Closed',
    Cancelled: 'Cancelled'
};

export type VacancyStatus = keyof typeof VacancyStatusEnum


export const VacancyApplicationStatusEnum = {
    Applied: 'Applied',
    Shortlisted: 'Shortlisted',
    Interviewed: 'Interviewed',
    Offered: 'Offered',
    Finilized: 'Finilized'
};

export type VacancyApplicationStatus = keyof typeof VacancyApplicationStatusEnum


export const CertificateTypeEnum = {
    HighSchoolDiploma: 'HighSchoolDiploma',
    NationalDiploma: 'NationalDiploma',
    BachelorsDegree: 'BachelorsDegree',
    MastersDegree: 'MastersDegree',
    PHD: 'PHD',
    Other: 'Other'
};
export type CertificateType = keyof typeof CertificateTypeEnum


///------------------------------Finance


export type TaxCode = {
    id?: number
    code_en: string
    code_ar: string
    description_en: string
    description_ar: string
    percentage: number
    is_deleted?: boolean
    item?: Item
}


export type Invoice = {
    id?: number
    invoice_no?: string
    invoice_date?: Date
    clientID?: number
    client?: Client
    companyID?: number
    company?: Company
    caseID?: number
    case?: Case
    gross_amount?: number
    tax_amount?: number
    net_amount?: number
    no_of_month?: number
    start_date?: Date
    next_payment_date?: Date
    pending_amount?: number
    payment_method?: PaymentType
    invoice_status?: FinanceStatus
    is_deleted?: boolean
    is_instalment?: boolean
    Receipts?: Receipt[]
    InvoiceItems: any,
    receipt_detail?: ReceiptDetail[]
    invoice_detail?: InvoiceDetail[]
    due_date?: Date
    is_checked?: boolean
    cheque_date?: Date
    drawn_on?: string
    cheque_number?: string
    amount_paid?: number
    recipient_name?: string
    comments?: string
}

export type InvoiceDetail = {
    id?: number
    invoiceID?: number
    invoice?: Invoice
    itemID?: number
    item?: Item
    item_name?: string
    description?: string
    gross_amount?: number
    tax_amount?: number
    net_amount?: number
    is_deleted?: boolean
}

export type Expense = {
    id?: number
    expense_no?: string
    expense_date?: Date
    supplierID?: number
    supplier?: Supplier
    gross_amount?: number
    tax_amount?: number
    net_amount?: number
    payment_method?: PaymentType
    expense_status?: FinanceStatus
    is_deleted?: boolean
    cheque_date?: Date
    drawn_on?: string
    cheque_number?: string
    documents?: Document[]
    expense_detail?: ExpenseDetail[]
}

export const FinanceStatusEnu = {
    Pending: 'Pending',
    Submited: 'Submited',
    Approved: 'Approved',
    Paid: 'Paid'
};

export type FinanceStatus = keyof typeof FinanceStatusEnu

export type ExpenseDetail = {
    id?: number
    expenseID?: number
    itemID?: number
    item?: Item
    description?: string
    item_name?: string
    gross_amount?: number
    tax_amount?: number
    net_amount?: number
    is_deleted?: boolean
}

export type Item = {
    id?: number
    name?: string
    type?: string
    taxcodeID?: number
    taxcode?: TaxCode
    rate?: number
    is_deleted?: boolean
    account_codeID?: number
    account_code?: AccountCode
    invoiceDetail?: InvoiceDetail[]
    expenseDetail?: ExpenseDetail[]
}

export type Receipt = {
    id?: number,
    receipt_no?: string
    cust_clientID?: number
    receipt_date?: Date
    description?: string
    amount?: number
    documents?: Document[]
    payment_method?: PaymentType
    receiptDetail?: ReceiptDetail[]
}

export type ReceiptDetail = {
    id?: number
    isSelected?: boolean,
    receiptID?: number
    recept?: Receipt
    invoiceID?: number
    invoice?: Invoice
    amount?: number
}

export type AccountType = {
    id?: number
    acc_type_en?: string
    acc_type_ar?: string
    acc_code?: AccountCode[]
}

export type AccountCode = {
    id?: number
    acc_typeID?: number
    acc_type?: AccountType
    acc_code_en?: string
    acc_code_ar?: string
    percentage?: number
    description_en?: string
    description_ar?: string
}
export type AccTransectionHeader = {
    id?: number
    document_no?: string
    date?: Date
    document_type?: string
    amount?: number
    status?: string
    matchingstatus?: string
    IdentifierId?: number
    acc_transection_detail?: AccTransectionDetail[]
}

export type AccTransectionDetail = {
    id?: number
    transectionID?: number
    transection?: AccTransectionHeader
    account_codeID?: number
    account_code_name?: string
    dr_cr?: string
    debit_amount?: number
    credit_amount?: number
    balance_amount?: number
    account_code?: AccountCode
}

export type PLBSCategory = {
    id?: number
    PLBSRPT?: string
    category?: string
    category_order?: String
}

export type PLBSSubCategory = {
    id?: number
    PLBSID?: number
    sub_category?: string
    sub_cat_order?: string
    account_code?: AccountCode[]
}

export type PLBSSubCatAccCodeMapping = {
    id?: number
    PLBSSubCatID?: number
    PLBSSubCat?: PLBSSubCategory
    account_codeID?: number
    account_code?: AccountCode
}

export type Supplier = {
    id?: number
    full_name?: string
    CPR?: number
    email?: string
    mobile1?: number
    mobile2?: number
    Address?: string
    nationality?: string
    whatsApp_phone?: number
    comments?: string
    expense?: Expense[]
}

export type Request = {
    id?: number
    name_ar?: string
    name_en?: string
    type?: CourtType
    Last_updated?: Date
    Last_updated_User?: string
}

export type CaseType = {
    id?: number
    name_ar?: string
    name_en?: string
    type?: CourtType
    comments?: string
    appeal_period?: number
    discrimination_period: number
    Last_updated?: Date
    Last_updated_User?: string
}
export type Leave_balance = {
    id?: number
    employee?: Employee
    employeeID?: number
    type?: LeaveType
    leaveTypeID?: number
    accual_days?: number
    balance?: number
    frequency?: string

}


export const CourtTypeEnum = {
    Lowful: 'Lowful',
    Civilian: 'Civilian',
    Criminal: 'Criminal',
    Excution: 'Excution'
};
export type DelayReson = {
    id?: number
    name_ar?: string
    name_en?: string
    type?: CourtType
    Last_updated?: Date
    Last_updated_User?: string
}

export type CaseRequest = {
    id?: number
    caseID?: number
    RequestID?: number
}

export type Announcement = {
    id?: number
    title?: number
    description?: string
    image?: string
    fromDate?: Date
    toDate?: Date
    document?: Document
}

export type employee_request = {
    id?: number
    from?: User
    from_userId?: number
    to?: User
    to_userId?: number
    subject?: string
    body?: string
    document?: Document[]
    doc_url?: string
    date?: Date
    IsRead?: Boolean
    Reply_to_id?: number
}
export type CourtType = keyof typeof CourtTypeEnum