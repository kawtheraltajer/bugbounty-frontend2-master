
export type SUPPORTED_LANGUAGE =
    'en' | // (English, default)
    'ar' | // (Arabic)
    'cz' | // (Czech)
    'dk' | // (Danish)
    'de' | // (German)
    'es' | // (Spanish)
    'fr' | // (French)
    'fa' | // (Farsi)
    'he' | // (Hebrew)
    'it' | // (Italian)
    'ko' | // (Korean)
    'lt' | // (Lithuanian)
    'lv' | // (Latvian)
    'nl' | // (Dutch)
    'no' | // (Norwegian)
    'pl' | // (Polish)
    'pt' | // (Portuguese)
    'ru' | // (Russian)
    'sr' | // (Serbian)
    'tr' | // (Turkish)
    'uk'; // (Ukrainian)
export const ProfileScalarFieldEnum = {
    id: 'id',
    userID: 'userID',
    bio: 'bio',
    pictureURL: 'pictureURL'
};

export type ProfileScalarField = (typeof ProfileScalarFieldEnum)[keyof typeof ProfileScalarFieldEnum]


export const UserScalarFieldEnum = {
    id: 'id',
    email: 'email',
    first_name: 'first_name',
    last_name: 'last_name',
    password: 'password',
    createdAt: 'createdAt',
    isActive: 'isActive',
    isLocked: 'isLocked',
    loginAttemp: 'loginAttemp',
    refreshToken_version: 'refreshToken_version',
    roleID: 'roleID',
    addressID: 'addressID'
};

export type UserScalarField = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


export const AppSettingsScalarFieldEnum = {
    id: 'id',
    details: 'details'
};

export type AppSettingsScalarField = (typeof AppSettingsScalarFieldEnum)[keyof typeof AppSettingsScalarFieldEnum]


export const UserSettingsScalarFieldEnum = {
    id: 'id',
    details: 'details',
    userID: 'userID'
};

export type UserSettingsScalarField = (typeof UserSettingsScalarFieldEnum)[keyof typeof UserSettingsScalarFieldEnum]


export const EmployeeScalarFieldEnum = {
    id: 'id',
    userID: 'userID',
    supervisorID: 'supervisorID'
};

export type EmployeeScalarField = (typeof EmployeeScalarFieldEnum)[keyof typeof EmployeeScalarFieldEnum]


export const AnnouncementScalarFieldEnum = {
    id: 'id',
    title: 'title',
    description: 'description',
    image: 'image',
    fromDate: 'fromDate',
    toDate: 'toDate'
   
};
/*CompaniesScalarFieldEnum,
    
CaseTypeScalarFieldEnum,
 DelayResonScalarFieldEnum,
RequestsScalarFieldEnum,
ChargeTypeScalarFieldEnum,
 ReportScalarFieldEnum,*/

export type AnnouncementScalarField = (typeof AnnouncementScalarFieldEnum)[keyof typeof AnnouncementScalarFieldEnum]

export const LeaveScalarFieldEnum = {
    id: 'id',
    employeeID: 'employeeID',
    type: 'type'
};

export type LeaveScalarField = (typeof LeaveScalarFieldEnum)[keyof typeof LeaveScalarFieldEnum]


export const ClientScalarFieldEnum = {
    id: 'id',
    userID: 'userID'
};

export type ClientScalarField = (typeof ClientScalarFieldEnum)[keyof typeof ClientScalarFieldEnum]


export const DocumentScalarFieldEnum = {
    id: 'id',
    createdAt: 'createdAt',
    name: 'name',
    Type: 'Type',
    url: 'url',
    caseID: 'caseID',
    sessionID: 'sessionID'
};

export type DocumentScalarField = (typeof DocumentScalarFieldEnum)[keyof typeof DocumentScalarFieldEnum]


export const CaseScalarFieldEnum = {
    id: 'id',
    createdAt: 'createdAt',
    clientID: 'clientID',
    reference_no: 'reference_no',
    internalFile_no: 'internalFile_no',
    representativeID: 'representativeID',
    comment: 'comment',
    courtID: 'courtID',
    courtRoomID: 'courtRoomID',
    status: 'status',
    type: 'type'
};

export type CaseScalarField = (typeof CaseScalarFieldEnum)[keyof typeof CaseScalarFieldEnum]


export const ClaimScalarFieldEnum = {
    id: 'id',
    createdAt: 'createdAt',
    type: 'type',
    caseID: 'caseID',
    details: 'details',
    date: 'date',
    approval: 'approval'
};

export type ClaimScalarField = (typeof ClaimScalarFieldEnum)[keyof typeof ClaimScalarFieldEnum]


export const OpponentScalarFieldEnum = {
    id: 'id',
    name: 'name',
    cpr: 'cpr',
    main_mobile: 'main_mobile',
    secondry_mobile: 'secondry_mobile',
    nationality: 'nationality',
    email: 'email',
    organization: 'organization',
    addressID: 'addressID',
    caseID: 'caseID'
};

export type OpponentScalarField = (typeof OpponentScalarFieldEnum)[keyof typeof OpponentScalarFieldEnum]


export const AddressScalarFieldEnum = {
    id: 'id',
    country: 'country',
    line1: 'line1',
    line2: 'line2',
    block: 'block',
    road: 'road',
    building: 'building',
    flat: 'flat',
    floor: 'floor'
};

export type AddressScalarField = (typeof AddressScalarFieldEnum)[keyof typeof AddressScalarFieldEnum]


export const SessionScalarFieldEnum = {
    id: 'id',
    createdAt: 'createdAt',
    date: 'date',
    reference_no: 'reference_no',
    session_no: 'session_no',
    caseID: 'caseID',
    delay_reason: 'delay_reason',
    delay_details: 'delay_details',
    status: 'status',
    comment: 'comment'
};

export type SessionScalarField = (typeof SessionScalarFieldEnum)[keyof typeof SessionScalarFieldEnum]


export const AppraisalScalarFieldEnum = {
    id: 'id',
    year: 'year',
    month: 'month',
    status: 'status',
    typeID: 'typeID',
    employeeID: 'employeeID',
    appraiserID: 'appraiserID',
    isApproved: 'isApproved',
    overall_score: 'overall_score',
    overall_weightage: 'overall_weightage',
    complete_percentage: 'complete_percentage',
    isLocked: 'isLocked',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};

export type AppraisalScalarField = (typeof AppraisalScalarFieldEnum)[keyof typeof AppraisalScalarFieldEnum]


export const TaskScalarFieldEnum = {
    id: 'id',
    employeeID: 'employeeID',
    index: 'index',
    title: 'title',
    details: 'details',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    dueDate: 'dueDate',
    comments: 'comments',
    statusID: 'statusID',
    caseID: 'caseID'
};

export type TaskScalarField = (typeof TaskScalarFieldEnum)[keyof typeof TaskScalarFieldEnum]


export const TaskStatusScalarFieldEnum = {
    id: 'id',
    index: 'index',
    name_ar: 'name_ar',
    name_en: 'name_en',
    color: 'color',
    isHidden: 'isHidden',
    isChangesLocked: 'isChangesLocked',
    groupID: 'groupID'
};

export type TaskStatusScalarField = (typeof TaskStatusScalarFieldEnum)[keyof typeof TaskStatusScalarFieldEnum]


export const FeesScalarFieldEnum = {
    id: 'id',
    isPaid: 'isPaid',
    description: 'description'
};

export type FeesScalarField = (typeof FeesScalarFieldEnum)[keyof typeof FeesScalarFieldEnum]


export const GroupScalarFieldEnum = {
    id: 'id',
    name: 'name',
    description: 'description',
    leaderID: 'leaderID'
};

export type GroupScalarField = (typeof GroupScalarFieldEnum)[keyof typeof GroupScalarFieldEnum]


export const PermissionScalarFieldEnum = {
    id: 'id',
    name: 'name',
    description: 'description',
    auth_field: 'auth_field',
    view_fields: 'view_fields',
    subject: 'subject',
    action: 'action',
    module: 'module'
};

export type PermissionScalarField = (typeof PermissionScalarFieldEnum)[keyof typeof PermissionScalarFieldEnum]


export const RoleScalarFieldEnum = {
    id: 'id',
    name: 'name',
    description: 'description'
};

export type RoleScalarField = (typeof RoleScalarFieldEnum)[keyof typeof RoleScalarFieldEnum]

export const TimeSlotScalarFieldEnum = {
    id: 'id',
    employee: 'employee',
    employeeID: 'employeeID',
    startTime: 'startTime',
    endTime: 'endTime',
    date: 'date',
    isApproved: 'isApproved',
    isBooked: 'isBooked',
    createdAt: 'createdAt',
    // appointment: 'appointment'
};

export type TimeSlotScalarField = (typeof TimeSlotScalarFieldEnum)[keyof typeof TimeSlotScalarFieldEnum]


export const AppointmentScalarFieldEnum = {
    id: 'id',
    typeID: 'typeID',
    clientID: 'clientID',
    client_name: 'client_name',
    client_type: 'client_type',
    client_cpr: 'client_cpr',
    client_email: 'client_email',
    client_phone: 'client_phone',
    case_description: 'case_description',
    timeSlotID: 'timeSlotID',
    canceled: 'canceled',
    cancellation_reson: 'cancellation_reson'
};

export type AppointmentScalarField = (typeof AppointmentScalarFieldEnum)[keyof typeof AppointmentScalarFieldEnum]

export const AppointmentTypeScalarFieldEnum = {
    id: 'id',
    title_en: 'title_en',
    title_ar: 'title_ar',
    color: 'color'
};

export type AppointmentTypeScalarField = (typeof AppointmentTypeScalarFieldEnum)[keyof typeof AppointmentTypeScalarFieldEnum]



export const CourtScalarFieldEnum = {
    id: 'id',
    name: 'name',
    location: 'location'
};

export type CourtScalarField = (typeof CourtScalarFieldEnum)[keyof typeof CourtScalarFieldEnum]


export const CourtRoomScalarFieldEnum = {
    id: 'id',
    number: 'number',
    title: 'title',
    courtID: 'courtID'
};

export type CourtRoomScalarField = (typeof CourtRoomScalarFieldEnum)[keyof typeof CourtRoomScalarFieldEnum]


export const AvailableHoursScalarFieldEnum = {
    id: 'id',
    date: 'date'
};

export type AvailableHoursScalarField = (typeof AvailableHoursScalarFieldEnum)[keyof typeof AvailableHoursScalarFieldEnum]


export const LogScalarFieldEnum = {
    id: 'id',
    description: 'description',
    details: 'details',
    type: 'type',
    userId: 'userId',
    createdAt: 'createdAt'
};

export type LogScalarField = (typeof LogScalarFieldEnum)[keyof typeof LogScalarFieldEnum]


export const SortOrder = {
    asc: 'asc',
    desc: 'desc'
};

export type SortO = (typeof SortOrder)[keyof typeof SortOrder]
