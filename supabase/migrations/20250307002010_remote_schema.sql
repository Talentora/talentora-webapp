alter table "public"."applicants" drop column "merge_applicant_id";

alter table "public"."applicants" add column "merge_candidate_id" uuid;


