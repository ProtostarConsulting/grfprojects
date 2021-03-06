export class PartnerSchool {
    id: string;
    schoolName: string;
    instName: string;
    formNumber: string;
    category: string;
    primaryContact: string;
    autoGenerated: string;
    govRegisterno: string;
    instituteID: number = +'5910974510923776';
    address: Address = new Address();
    contactDetail: ContactDetail = new ContactDetail();
    examDetailList: Array<ExamDetail>;
    schoolSelfUpdate: boolean;
}

export class Address {
    line1: string;
    line2: string;
    country: "India";
    city: string;
    dist: string;
    state: string;
    tal: string;
    pin: string;
    otherAddressFlag: boolean;
    otherState: string;
    otherDist: string;
    otherTal: string;
}

export class ContactDetail {
    headMasterName: string;
    headMasterMobile: string;
    headMasterPhone: string;
    headMasterEmailId: string;
    coordinatorDetail: Array<CoordinatorDetail>;
}

export class CoordinatorDetail {
    srno: number;
    coordinatorName: string;
    coordinatorPhoneNum: string;
    coordinatorEmailId: string;
    coordinatorMobileNum: string;
}

export class ExamDetail {
    totalStudent: string;
    male: string;
    female: string;
    total: number;
    yearOfExam: string;
    bookRequired: string;
    modeOfExam: string;
    bookSummary: BookSummary = new BookSummary();
    notificationData: NotificationData = new NotificationData();
    paymentDetail: any;
}

export class BookSummary {
    total: number;
    amtForInst20per: number;
    amtForGRF80per: number;
    bookDetail: Array<BookDetail>;
}

export class BookDetail {
    bookName: string;
    bookPrise: number;
    standard: string;
    totalStud: number = 0;
    totalFees: number;
    appearedTotalStud: number;
}

export class PaymentDetail {
    payReceivedBy: string;
    paymentDate: Date = new Date();
    payAmount: number;
    tPaid: number;
    pAmount: number;
    note: string;
    nameOfBank: string;
    branchName: string;
    transactionNumber: string;
    depositDate: Date = new Date();
}

export class NotificationData {
    registrationSmsSent: number = 0;
    currierSmsSent: number = 0;
    registrationEmailSent: number = 0;
    currierEmailSent: number = 0;
}