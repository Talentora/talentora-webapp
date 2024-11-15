alter table "public"."applications" drop constraint "applications_harvest_applications_key";

drop index if exists "public"."applications_harvest_applications_key";

alter table "public"."applicants" alter column "id" set default gen_random_uuid();

alter table "public"."applications" drop column "harvest_applications";

alter table "public"."companies" add column "company_context" uuid;

DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'applications_applicant_id_fkey'
    ) THEN
        alter table "public"."applications" add constraint "applications_applicant_id_fkey" 
        FOREIGN KEY (applicant_id) REFERENCES applicants(id) not valid;

        alter table "public"."applications" validate constraint "applications_applicant_id_fkey";
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'companies_company_context_fkey'
    ) THEN
        alter table "public"."companies" add constraint "companies_company_context_fkey" 
        FOREIGN KEY (company_context) REFERENCES company_context(id) not valid;

        alter table "public"."companies" validate constraint "companies_company_context_fkey";
    END IF;
END $$;

create policy "View application"
on "public"."applications"
as permissive
for select
to authenticated
using (true);




