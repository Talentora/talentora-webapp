create table "public"."applicants" (
    "id" bigint generated always as identity not null,
    "first_name" text not null,
    "last_name" text not null,
    "email" text not null,
    "phone_number" text,
    "resume" text,
    "job_id" bigint
);


alter table "public"."applicants" enable row level security;

create table "public"."companies" (
    "id" bigint generated always as identity not null,
    "name" text not null,
    "location" text,
    "industry" text
);


alter table "public"."companies" enable row level security;

create table "public"."jobs" (
    "id" bigint generated always as identity not null,
    "title" text not null,
    "description" text,
    "salary_range" text,
    "company_id" bigint,
    "applicant_count" bigint default 0,
    "location" text default 'Boston, MA'::text,
    "Department" text default 'Marketing'::text
);


alter table "public"."jobs" enable row level security;

CREATE UNIQUE INDEX applicants_email_key ON public.applicants USING btree (email);

CREATE UNIQUE INDEX applicants_pkey ON public.applicants USING btree (id);

CREATE UNIQUE INDEX companies_pkey ON public.companies USING btree (id);

CREATE UNIQUE INDEX jobs_pkey ON public.jobs USING btree (id);

alter table "public"."applicants" add constraint "applicants_pkey" PRIMARY KEY using index "applicants_pkey";

alter table "public"."companies" add constraint "companies_pkey" PRIMARY KEY using index "companies_pkey";

alter table "public"."jobs" add constraint "jobs_pkey" PRIMARY KEY using index "jobs_pkey";

alter table "public"."applicants" add constraint "applicants_email_key" UNIQUE using index "applicants_email_key";

alter table "public"."applicants" add constraint "applicants_job_id_fkey" FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE not valid;

alter table "public"."applicants" validate constraint "applicants_job_id_fkey";

alter table "public"."jobs" add constraint "jobs_company_id_fkey" FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE not valid;

alter table "public"."jobs" validate constraint "jobs_company_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.update_applicant_count()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
    update jobs
    set applicant_count = (select count(*) from applicants where job_id = NEW.id)
    where id = NEW.id;
    
    return NEW;
end;
$function$
;

grant delete on table "public"."applicants" to "anon";

grant insert on table "public"."applicants" to "anon";

grant references on table "public"."applicants" to "anon";

grant select on table "public"."applicants" to "anon";

grant trigger on table "public"."applicants" to "anon";

grant truncate on table "public"."applicants" to "anon";

grant update on table "public"."applicants" to "anon";

grant delete on table "public"."applicants" to "authenticated";

grant insert on table "public"."applicants" to "authenticated";

grant references on table "public"."applicants" to "authenticated";

grant select on table "public"."applicants" to "authenticated";

grant trigger on table "public"."applicants" to "authenticated";

grant truncate on table "public"."applicants" to "authenticated";

grant update on table "public"."applicants" to "authenticated";

grant delete on table "public"."applicants" to "service_role";

grant insert on table "public"."applicants" to "service_role";

grant references on table "public"."applicants" to "service_role";

grant select on table "public"."applicants" to "service_role";

grant trigger on table "public"."applicants" to "service_role";

grant truncate on table "public"."applicants" to "service_role";

grant update on table "public"."applicants" to "service_role";

grant delete on table "public"."companies" to "anon";

grant insert on table "public"."companies" to "anon";

grant references on table "public"."companies" to "anon";

grant select on table "public"."companies" to "anon";

grant trigger on table "public"."companies" to "anon";

grant truncate on table "public"."companies" to "anon";

grant update on table "public"."companies" to "anon";

grant delete on table "public"."companies" to "authenticated";

grant insert on table "public"."companies" to "authenticated";

grant references on table "public"."companies" to "authenticated";

grant select on table "public"."companies" to "authenticated";

grant trigger on table "public"."companies" to "authenticated";

grant truncate on table "public"."companies" to "authenticated";

grant update on table "public"."companies" to "authenticated";

grant delete on table "public"."companies" to "service_role";

grant insert on table "public"."companies" to "service_role";

grant references on table "public"."companies" to "service_role";

grant select on table "public"."companies" to "service_role";

grant trigger on table "public"."companies" to "service_role";

grant truncate on table "public"."companies" to "service_role";

grant update on table "public"."companies" to "service_role";

grant delete on table "public"."jobs" to "anon";

grant insert on table "public"."jobs" to "anon";

grant references on table "public"."jobs" to "anon";

grant select on table "public"."jobs" to "anon";

grant trigger on table "public"."jobs" to "anon";

grant truncate on table "public"."jobs" to "anon";

grant update on table "public"."jobs" to "anon";

grant delete on table "public"."jobs" to "authenticated";

grant insert on table "public"."jobs" to "authenticated";

grant references on table "public"."jobs" to "authenticated";

grant select on table "public"."jobs" to "authenticated";

grant trigger on table "public"."jobs" to "authenticated";

grant truncate on table "public"."jobs" to "authenticated";

grant update on table "public"."jobs" to "authenticated";

grant delete on table "public"."jobs" to "service_role";

grant insert on table "public"."jobs" to "service_role";

grant references on table "public"."jobs" to "service_role";

grant select on table "public"."jobs" to "service_role";

grant trigger on table "public"."jobs" to "service_role";

grant truncate on table "public"."jobs" to "service_role";

grant update on table "public"."jobs" to "service_role";

CREATE TRIGGER update_applicant_count_trigger AFTER INSERT OR DELETE ON public.applicants FOR EACH ROW EXECUTE FUNCTION update_applicant_count();


