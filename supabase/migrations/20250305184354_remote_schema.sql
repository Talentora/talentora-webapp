alter table "public"."AI_summary" add column "resume_analysis" jsonb;

alter table "public"."AI_summary" enable row level security;

alter table "public"."applicants" add column "email" text;

alter table "public"."applicants" add column "full_name" text;

alter table "public"."applicants" add column "user_id" uuid;

alter table "public"."applicants" disable row level security;

alter table "public"."applications" add column "merge_application_id" text;

alter table "public"."job_interview_config" add column "prompt_graph" jsonb;

alter table "public"."job_interview_config" disable row level security;

alter table "public"."applicants" add constraint "fk_user_id" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."applicants" validate constraint "fk_user_id";


