import { PartnerSchool } from '../partnerschool/partner-school';

export class ExamResultList {
    school:PartnerSchool;
    list:Array<ExamResult>;
}

export class ExamResult {
    id:string;
    studName: string;
    examYear:string;
    standard:string;
    mediumOfAnswer:string;
    marks:string;
    grfReviewed: boolean;
    school: PartnerSchool;
    createdDate:Date = new Date();
}