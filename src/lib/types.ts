export type AppStatus =
  | 'Wishlist'
  | 'Applied'
  | 'Phone screen'
  | 'Interviewing'
  | 'Offer'
  | 'Rejected'
  | 'Ghosted'
  | 'Withdrawn';

export type Priority = 'High' | 'Medium' | 'Low';
export type Channel =
  | 'LinkedIn'
  | 'Referral'
  | 'Company site'
  | 'Recruiter'
  | 'Indeed'
  | 'Cold outreach'
  | 'Networking'
  | 'Other';
export type RemotePolicy = 'Remote' | 'Hybrid' | 'On-site';

export interface Application {
  id: string;
  company: string;
  role: string;
  status: AppStatus;
  priority: Priority;
  channel: Channel;
  salaryRange: string;
  location: string;
  remote: RemotePolicy;
  dateApplied: string;
  nextAction: string;
  nextActionDate: string;
  jobUrl: string;
  notes: string;
  contactId: string;
}

export type FollowMethod = 'Email' | 'LinkedIn' | 'Phone' | 'Other';
export type FollowStatus = 'Due' | 'Scheduled' | 'Done' | 'Skipped';

export interface FollowUp {
  id: string;
  appId: string;
  company: string;
  method: FollowMethod;
  lastTouch: string;
  nextTouch: string;
  status: FollowStatus;
  notes: string;
  priority: Priority;
}

export type InterviewFormat = 'Zoom' | 'Phone' | 'Google Meet' | 'On-site' | 'Other';
export type PrepStatus = 'Not started' | 'Prepared' | 'Completed';

export interface Interview {
  id: string;
  appId: string;
  company: string;
  role: string;
  round: string;
  date: string;
  time: string;
  format: InterviewFormat;
  interviewers: string;
  prepStatus: PrepStatus;
  prepNotes: string;
  outcomeNotes: string;
}

export type OfferDecision = 'Pending' | 'Accept' | 'Decline' | 'Negotiate';

export interface Offer {
  id: string;
  appId: string;
  company: string;
  role: string;
  offerDate: string;
  decisionDeadline: string;
  baseSalary: number;
  bonus: number;
  equityEst: number;
  ptoDays: number;
  remotePolicy: string;
  relocation: string;
  otherComp: string;
  decision: OfferDecision;
  pros: string;
  cons: string;
  /** 1-10 subjective scores for comparison */
  scoreBase: number;
  scoreBonus: number;
  scoreRemote: number;
  scoreGrowth: number;
}

export type Relationship =
  | 'Referral'
  | 'Recruiter'
  | 'Hiring manager'
  | 'Peer'
  | 'Mentor'
  | 'Other';
export type Warmth = 'Warm' | 'Cold';

export interface Contact {
  id: string;
  name: string;
  company: string;
  title: string;
  relationship: Relationship;
  email: string;
  linkedIn: string;
  warmth: Warmth;
  notes: string;
}

export interface StoreData {
  applications: Application[];
  followUps: FollowUp[];
  interviews: Interview[];
  offers: Offer[];
  contacts: Contact[];
  counters: {
    app: number;
    fu: number;
    int: number;
    off: number;
    con: number;
  };
}

export type TabId =
  | 'dashboard'
  | 'applications'
  | 'followups'
  | 'interviews'
  | 'offers'
  | 'contacts';
