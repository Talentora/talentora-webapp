// /types/greenhouse.ts

export type HiringTeam = {
  hiring_managers: any[];
  recruiters: any[];
  coordinators: any[];
  sourcers: any[];
};

export type Opening = {
  opening_id: number;
  opened_at: string;
  status: string;
};

export type CustomFields = {
  employment_type: string | null;
  reason_for_hire: string | null;
};

export type Attachment = {
  filename: string;
  url: string;
  type: string;
  created_at: string;
};

export type Source = {
  id: number;
  public_name: string;
};

export type CreditedTo = {
  id: number;
  first_name: string;
  last_name: string;
  name: string;
  employee_id: string | null;
};

export type CurrentStage = {
  id: number;
  name: string;
};

export type JobReference = {
  id: number;
  name: string;
};

export type ProspectDetail = {
  prospect_pool: string | null;
  prospect_stage: string | null;
  prospect_owner: string | null;
};

export type Application = {
  id: number;
  candidate_id: number;
  prospect: boolean;
  applied_at: string;
  rejected_at: string | null;
  last_activity_at: string;
  location: string | null;
  attachments: Attachment[];
  source: Source;
  credited_to: CreditedTo;
  rejection_reason: string | null;
  rejection_details: string | null;
  jobs: JobReference[];
  job_post_id: number | null;
  status: string;
  current_stage: CurrentStage;
  answers: any[];
  prospective_department: string | null;
  prospective_office: string | null;
  prospect_detail: ProspectDetail;
};

export type PhoneNumber = {
  value: string;
  type: string;
};

export type EmailAddress = {
  value: string;
  type: string;
};

export type Candidate = {
  id: number;
  first_name: string;
  last_name: string;
  company: string | null;
  title: string | null;
  created_at: string;
  updated_at: string;
  last_activity: string;
  is_private: boolean;
  photo_url: string | null;
  attachments: Attachment[];
  application_ids: number[];
  phone_numbers: PhoneNumber[];
  addresses: any[];
  email_addresses: EmailAddress[];
  website_addresses: any[];
  social_media_addresses: any[];
  recruiter: any | null;
  coordinator: any | null;
  can_email: boolean;
  tags: any[];
  applications: Application[];
  educations: any[];
  employments: any[];
  linked_user_ids: number[];
  custom_fields: { work_authorization: string | null };
  keyed_custom_fields: { work_authorization: string | null };
};

export type Job = {
  id: number;
  name: string;
  requisition_id: string | null;
  notes: string | null;
  confidential: boolean;
  is_template: boolean | null;
  copied_from_id: number | null;
  status: string;
  created_at: string;
  opened_at: string;
  closed_at: string | null;
  updated_at: string;
  departments: (string | null)[];
  offices: any[];
  hiring_team: HiringTeam;
  openings: Opening[];
  custom_fields: CustomFields;
  keyed_custom_fields: CustomFields;
};

export type ApplicantCandidate = Application & { candidate: Candidate };
