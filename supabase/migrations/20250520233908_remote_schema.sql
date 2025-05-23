create type "public"."recruiter_role" as enum ('admin', 'recruiter', 'viewer');

create type "public"."recruiter_status" as enum ('active', 'pending_interview', 'interview_completed');

drop policy "Recruiters can see their own applications" on "public"."applications";

drop policy "Select Jobs from user company" on "public"."jobs";

alter table "public"."AI_summary" add column "culture_fit" jsonb;

alter table "public"."AI_summary" add column "updated_at" timestamp without time zone default now();

alter table "public"."job_interview_config" drop column "min_qual";

alter table "public"."job_interview_config" drop column "preferred_qual";

alter table "public"."jobs" drop column "job_name";

alter table "public"."jobs" add column "created_at" date default now();

alter table "public"."jobs" add column "description" text;

alter table "public"."jobs" add column "name" text;

alter table "public"."jobs" disable row level security;

alter table "public"."recruiters" add column "role" recruiter_role;

alter table "public"."recruiters" add column "status" recruiter_status;

CREATE UNIQUE INDEX "AI_summary_application_id_key" ON public."AI_summary" USING btree (application_id);

alter table "public"."AI_summary" add constraint "AI_summary_application_id_key" UNIQUE using index "AI_summary_application_id_key";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$
;

create policy "Enable insert for authenticated users only"
on "public"."applications"
as permissive
for insert
to authenticated, anon
with check (true);


create policy "Recruiters can see their own applications"
on "public"."applications"
as permissive
for select
to public
using ((EXISTS ( SELECT 1
   FROM (jobs
     JOIN recruiters ON ((jobs.company_id = recruiters.company_id)))
  WHERE ((applications.job_id = jobs.merge_id) AND (recruiters.id = auth.uid())))));


create policy "Select Jobs from user company"
on "public"."jobs"
as permissive
for select
to authenticated, anon, authenticator, dashboard_user, pgbouncer, service_role
using ((EXISTS ( SELECT 1
   FROM recruiters
  WHERE ((recruiters.id = auth.uid()) AND (recruiters.company_id = jobs.company_id)))));


CREATE TRIGGER update_updated_at BEFORE UPDATE ON public."AI_summary" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


