type Application = {
  id: string;
  remote_id: string;
  candidate: string;
  job: string;
  applied_at: string;
  rejected_at: string | null;
  source: string | null;
  credited_to: string | null;
  current_stage: string | null;
  reject_reason: string | null;
  remote_data: any | null;
};

type Candidate = {
  id: string;
  remote_id: string;
  first_name: string;
  last_name: string;
  company: string | null;
  title: string | null;
  remote_created_at: string | null;
  remote_updated_at: string | null;
  last_interaction_at: string | null;
  is_private: boolean;
  can_email: boolean;
  locations: string[];
  phone_numbers: Array<{value: string, phone_number_type: string}>;
  email_addresses: Array<{value: string, email_address_type: string}>;
  urls: Array<{value: string, url_type: string}>;
  tags: string[];
  applications: string[];
  attachments: string[];
  remote_data: any | null;
};
type JobInterviewStage = {
  id: string;
  remote_id: string;
  created_at: string;
  modified_at: string;
  name: string;
  job: string;
  stage_order: number;
  remote_was_deleted: boolean;
  field_mappings: {
    organization_defined_targets: Record<string, any>;
    linked_account_defined_targets: Record<string, any>;
  };
  remote_data: Array<{
    path: string;
    data: any[];
  }> | null;
};

type Attachment = {
  id: string;
  remote_id: string;
  file_name: string;
  file_url: string;
  candidate: string;
  attachment_type: string;
  remote_data: any | null;
};

type SimpleJob = {
  id: string;
  remote_id: string;
  created_at: string;
  modified_at: string;
  name: string;
  description: string | null;
  code: string | null;
  status: string;
  type: string;
  job_postings: any[];
  job_posting_urls: string[];
  remote_created_at: string;
  remote_updated_at: string;
  confidential: boolean;
  departments: any[];
  offices: any[];
  hiring_managers: any[];
  recruiters: any[];
  remote_was_deleted: boolean;
  field_mappings: {
    organization_defined_targets: Record<string, any>;
    linked_account_defined_targets: Record<string, any>;
  };
  remote_data: any | null;
};

type Department = {
  id: string;
  remote_id: string | null;
  name: string;
  remote_data: Array<{
    path: string;
    data: string;
  }> | null;
};

type Office = {
  id: string;
  remote_id: string | null;
  name: string;
  location: string | null;
  remote_data: Array<{
    path: string;
    data: string;
  }> | null;
};

type Recruiter = {
  id: string;
  remote_id: string | null;
  created_at: string;
  modified_at: string;
  first_name: string;
  last_name: string;
  email: string;
  disabled: boolean;
  remote_created_at: string;
  access_role: string;
  remote_was_deleted: boolean;
  field_mappings: {
    organization_defined_targets: Record<string, any>;
    linked_account_defined_targets: Record<string, any>;
  };
  remote_data: Array<{
    path: string;
    data: any[];
  }> | null;
};




// ApplicantCandidate type
export type ApplicantCandidate = Application & { candidate: Candidate, job: Job, interviewStages: JobInterviewStage[]};

export type Job = SimpleJob & { departments: Department[], offices: Office[] };

// export types
export type { Application, Candidate, JobInterviewStage, Recruiter };
