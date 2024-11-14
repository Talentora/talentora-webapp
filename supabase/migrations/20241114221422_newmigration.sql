drop policy "allow_supabase_service_role" on "public"."applicants";

drop policy "allow_supabase_service_role" on "public"."recruiters";

alter table "public"."applications" drop constraint "applications_applicant_id_fkey";

create policy "allow_supabase_service_role"
on "public"."applicants"
as permissive
for all
to authenticated, anon, supabase_auth_admin
using (true);


create policy "allow_supabase_service_role"
on "public"."recruiters"
as permissive
for all
to authenticated, anon, supabase_auth_admin
using (true);




