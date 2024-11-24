drop policy "Modify bots" on "public"."bots";

drop policy "policy_name" on "public"."companies";

drop policy "Allow recruiters to modify company_context" on "public"."company_context";

drop policy "Edit job config" on "public"."job_interview_config";

alter table "public"."applicants" drop constraint "applicants_harvest_applicants_key";

alter table "public"."applications" drop constraint "applications_pkey";

alter table "public"."jobs" drop constraint "jobs_pkey";

drop index if exists "public"."applicants_harvest_applicants_key";

drop index if exists "public"."applications_pkey";

drop index if exists "public"."jobs_pkey";

alter table "public"."applicants" drop column "harvest_applicants";

alter table "public"."applicants" add column "merge_applicant_id" uuid;

alter table "public"."applications" add column "id" uuid not null default gen_random_uuid();

alter table "public"."jobs" add column "id" uuid not null default gen_random_uuid();

alter table "public"."jobs" alter column "merge_id" drop default;

CREATE UNIQUE INDEX applications_pkey ON public.applications USING btree (id);

CREATE UNIQUE INDEX jobs_pkey ON public.jobs USING btree (id);

alter table "public"."applications" add constraint "applications_pkey" PRIMARY KEY using index "applications_pkey";

alter table "public"."jobs" add constraint "jobs_pkey" PRIMARY KEY using index "jobs_pkey";

create policy "Modify bots"
on "public"."bots"
as permissive
for all
to authenticated
using (true);


create policy "policy_name"
on "public"."companies"
as permissive
for all
to authenticated
using (true);


create policy "Allow recruiters to modify company_context"
on "public"."company_context"
as permissive
for all
to public
using (true);


create policy "Edit job config"
on "public"."job_interview_config"
as permissive
for all
to authenticated
using (true);



