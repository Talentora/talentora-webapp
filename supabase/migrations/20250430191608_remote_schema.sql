create type "public"."application_status" as enum ('not_invited', 'pending_interview', 'interview_completed');

drop policy "Enable insert for authenticated users only" on "public"."applications";

drop policy "View application" on "public"."applications";

drop policy "Modify bots" on "public"."bots";

drop policy "Select Jobs" on "public"."jobs";

alter table "public"."applications" add column "status" application_status default 'not_invited'::application_status;

alter table "public"."applications" enable row level security;

alter table "public"."companies" add column "merge_linked_account_id" uuid;

alter table "public"."form_messages" enable row level security;

alter table "public"."jobs" add column "job_name" text;

alter table "public"."jobs" add column "job_resume_config" jsonb;

alter table "public"."recruiters" add column "email" text;

alter table "public"."recruiters" add column "full_name" text;

CREATE UNIQUE INDEX companies_linked_account_id_key ON public.companies USING btree (merge_linked_account_id);

alter table "public"."companies" add constraint "companies_linked_account_id_key" UNIQUE using index "companies_linked_account_id_key";

create policy "Recruiters can see their own applications"
on "public"."applications"
as permissive
for select
to public
using ((EXISTS ( SELECT 1
   FROM (jobs
     JOIN recruiters ON ((jobs.company_id = recruiters.company_id)))
  WHERE ((applications.job_id = jobs.id) AND (recruiters.id = auth.uid())))));


create policy "applicants can view their own application"
on "public"."applications"
as permissive
for select
to authenticated
using ((applicant_id = auth.uid()));


create policy "Enable delete for users based on user_id"
on "public"."bots"
as permissive
for delete
to authenticated
using ((EXISTS ( SELECT 1
   FROM recruiters
  WHERE ((recruiters.id = auth.uid()) AND (recruiters.company_id = bots.company_id)))));


create policy "Enable insert for users based on user_id"
on "public"."bots"
as permissive
for insert
to authenticated
with check ((EXISTS ( SELECT 1
   FROM recruiters
  WHERE ((recruiters.id = auth.uid()) AND (recruiters.company_id = bots.company_id)))));


create policy "Enable updates for company's bots"
on "public"."bots"
as permissive
for update
to authenticated
using ((EXISTS ( SELECT 1
   FROM recruiters
  WHERE ((recruiters.id = auth.uid()) AND (recruiters.company_id = bots.company_id)))))
with check ((EXISTS ( SELECT 1
   FROM recruiters
  WHERE ((recruiters.id = auth.uid()) AND (recruiters.company_id = bots.company_id)))));


create policy "Enable users to view their own data only"
on "public"."bots"
as permissive
for select
to authenticated
using ((EXISTS ( SELECT 1
   FROM recruiters
  WHERE ((recruiters.id = auth.uid()) AND (recruiters.company_id = bots.company_id)))));


create policy "applicants can see all bots"
on "public"."bots"
as permissive
for select
to public
using ((((auth.jwt() -> 'user_metadata'::text) ->> 'role'::text) = 'applicant'::text));


create policy "Enable read access for all users"
on "public"."companies"
as permissive
for select
to anon, service_role, authenticated
using (true);


create policy "Enable update for users based on email"
on "public"."companies"
as permissive
for update
to service_role
using (true)
with check (true);


create policy "for all"
on "public"."form_messages"
as permissive
for all
to anon, authenticated
using (true)
with check (true);


create policy "Select Jobs from user company"
on "public"."jobs"
as permissive
for select
to public
using ((EXISTS ( SELECT 1
   FROM recruiters
  WHERE ((recruiters.id = auth.uid()) AND (recruiters.company_id = jobs.company_id)))));


create policy "applicants view jobs"
on "public"."jobs"
as permissive
for select
to public
using ((((auth.jwt() -> 'user_metadata'::text) ->> 'role'::text) = 'applicant'::text));



