drop trigger if exists "update_applicant_count_trigger" on "public"."applicants";

drop policy "Enable read access for all users" on "public"."applicants";

alter table "public"."applicants" drop constraint "applicants_email_key";

alter table "public"."applicants" drop constraint "applicants_job_id_fkey";

alter table "public"."jobs" drop constraint "jobs_company_id_fkey";

alter table "public"."applicants" drop constraint "applicants_pkey";

drop index if exists "public"."applicants_email_key";

drop index if exists "public"."applicants_pkey";

create table "public"."AI_config" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now()
);


alter table "public"."AI_config" enable row level security;

create table "public"."AI_summary" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now()
);


alter table "public"."AI_summary" enable row level security;

create table "public"."applications" (
    "created_at" timestamp with time zone not null default now(),
    "applicant_id" uuid not null,
    "job_id" uuid not null,
    "AI_summary" uuid
);


alter table "public"."applications" enable row level security;

create table "public"."jobs_posted" (
    "created_at" timestamp with time zone not null default now(),
    "user_id" uuid not null,
    "job_id" uuid not null,
    "AI_config_id" uuid
);


alter table "public"."jobs_posted" enable row level security;

alter table "public"."applicants" drop column "job_id";

alter table "public"."applicants" alter column "email" drop not null;

alter table "public"."applicants" alter column "first_name" drop not null;

alter table "public"."applicants" alter column "id" set default gen_random_uuid();

alter table "public"."applicants" alter column "id" drop identity;

alter table "public"."applicants" alter column "id" set data type uuid using "id"::uuid;

alter table "public"."applicants" alter column "last_name" drop not null;

alter table "public"."companies" add column "email_extension" text;

alter table "public"."companies" add column "subscription_id" text default gen_random_uuid();

alter table "public"."companies" add column "website_url" text;

alter table "public"."companies" alter column "id" set default auth.uid();

alter table "public"."companies" alter column "id" drop identity;

alter table "public"."companies" alter column "id" set data type uuid using "id"::uuid;

alter table "public"."jobs" drop column "applicant_count";

alter table "public"."jobs" add column "interview_questions" text[];

alter table "public"."jobs" alter column "company_id" set not null;

alter table "public"."jobs" alter column "id" set default auth.uid();

alter table "public"."jobs" alter column "id" drop identity;

alter table "public"."jobs" alter column "id" set data type uuid using "id"::uuid;

alter table "public"."jobs" enable row level security;

alter table "public"."users" drop column "full_name";

alter table "public"."users" add column "company_id" uuid;

alter table "public"."users" add column "email" text;

alter table "public"."users" add column "first_name" text;

alter table "public"."users" add column "last_name" text;

CREATE UNIQUE INDEX "AI_config_pkey" ON public."AI_config" USING btree (id);

CREATE UNIQUE INDEX "AI_summary_pkey" ON public."AI_summary" USING btree (id);

CREATE UNIQUE INDEX applicants1_pkey ON public.applicants USING btree (id);

CREATE UNIQUE INDEX applications_pkey ON public.applications USING btree (applicant_id, job_id);

CREATE UNIQUE INDEX jobs_posted_job_id_key ON public.jobs_posted USING btree (job_id);

CREATE UNIQUE INDEX jobs_posted_pkey ON public.jobs_posted USING btree (user_id);

alter table "public"."AI_config" add constraint "AI_config_pkey" PRIMARY KEY using index "AI_config_pkey";

alter table "public"."AI_summary" add constraint "AI_summary_pkey" PRIMARY KEY using index "AI_summary_pkey";

alter table "public"."applicants" add constraint "applicants1_pkey" PRIMARY KEY using index "applicants1_pkey";

alter table "public"."applications" add constraint "applications_pkey" PRIMARY KEY using index "applications_pkey";

alter table "public"."jobs_posted" add constraint "jobs_posted_pkey" PRIMARY KEY using index "jobs_posted_pkey";

alter table "public"."applications" add constraint "applications_AI_summary_fkey" FOREIGN KEY ("AI_summary") REFERENCES "AI_summary"(id) not valid;

alter table "public"."applications" validate constraint "applications_AI_summary_fkey";

alter table "public"."applications" add constraint "applications_applicant_id_fkey" FOREIGN KEY (applicant_id) REFERENCES applicants(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."applications" validate constraint "applications_applicant_id_fkey";

alter table "public"."applications" add constraint "applications_job_id_fkey" FOREIGN KEY (job_id) REFERENCES jobs(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."applications" validate constraint "applications_job_id_fkey";

alter table "public"."companies" add constraint "companies_subscription_id_fkey" FOREIGN KEY (subscription_id) REFERENCES subscriptions(id) not valid;

alter table "public"."companies" validate constraint "companies_subscription_id_fkey";

alter table "public"."jobs_posted" add constraint "jobs_posted_AI_config_id_fkey" FOREIGN KEY ("AI_config_id") REFERENCES "AI_config"(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."jobs_posted" validate constraint "jobs_posted_AI_config_id_fkey";

alter table "public"."jobs_posted" add constraint "jobs_posted_job_id_fkey" FOREIGN KEY (job_id) REFERENCES jobs(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."jobs_posted" validate constraint "jobs_posted_job_id_fkey";

alter table "public"."jobs_posted" add constraint "jobs_posted_job_id_key" UNIQUE using index "jobs_posted_job_id_key";

alter table "public"."jobs_posted" add constraint "jobs_posted_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."jobs_posted" validate constraint "jobs_posted_user_id_fkey";

alter table "public"."users" add constraint "users_company_id_fkey" FOREIGN KEY (company_id) REFERENCES companies(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."users" validate constraint "users_company_id_fkey";

grant delete on table "public"."AI_config" to "anon";

grant insert on table "public"."AI_config" to "anon";

grant references on table "public"."AI_config" to "anon";

grant select on table "public"."AI_config" to "anon";

grant trigger on table "public"."AI_config" to "anon";

grant truncate on table "public"."AI_config" to "anon";

grant update on table "public"."AI_config" to "anon";

grant delete on table "public"."AI_config" to "authenticated";

grant insert on table "public"."AI_config" to "authenticated";

grant references on table "public"."AI_config" to "authenticated";

grant select on table "public"."AI_config" to "authenticated";

grant trigger on table "public"."AI_config" to "authenticated";

grant truncate on table "public"."AI_config" to "authenticated";

grant update on table "public"."AI_config" to "authenticated";

grant delete on table "public"."AI_config" to "service_role";

grant insert on table "public"."AI_config" to "service_role";

grant references on table "public"."AI_config" to "service_role";

grant select on table "public"."AI_config" to "service_role";

grant trigger on table "public"."AI_config" to "service_role";

grant truncate on table "public"."AI_config" to "service_role";

grant update on table "public"."AI_config" to "service_role";

grant delete on table "public"."AI_summary" to "anon";

grant insert on table "public"."AI_summary" to "anon";

grant references on table "public"."AI_summary" to "anon";

grant select on table "public"."AI_summary" to "anon";

grant trigger on table "public"."AI_summary" to "anon";

grant truncate on table "public"."AI_summary" to "anon";

grant update on table "public"."AI_summary" to "anon";

grant delete on table "public"."AI_summary" to "authenticated";

grant insert on table "public"."AI_summary" to "authenticated";

grant references on table "public"."AI_summary" to "authenticated";

grant select on table "public"."AI_summary" to "authenticated";

grant trigger on table "public"."AI_summary" to "authenticated";

grant truncate on table "public"."AI_summary" to "authenticated";

grant update on table "public"."AI_summary" to "authenticated";

grant delete on table "public"."AI_summary" to "service_role";

grant insert on table "public"."AI_summary" to "service_role";

grant references on table "public"."AI_summary" to "service_role";

grant select on table "public"."AI_summary" to "service_role";

grant trigger on table "public"."AI_summary" to "service_role";

grant truncate on table "public"."AI_summary" to "service_role";

grant update on table "public"."AI_summary" to "service_role";

grant delete on table "public"."applications" to "anon";

grant insert on table "public"."applications" to "anon";

grant references on table "public"."applications" to "anon";

grant select on table "public"."applications" to "anon";

grant trigger on table "public"."applications" to "anon";

grant truncate on table "public"."applications" to "anon";

grant update on table "public"."applications" to "anon";

grant delete on table "public"."applications" to "authenticated";

grant insert on table "public"."applications" to "authenticated";

grant references on table "public"."applications" to "authenticated";

grant select on table "public"."applications" to "authenticated";

grant trigger on table "public"."applications" to "authenticated";

grant truncate on table "public"."applications" to "authenticated";

grant update on table "public"."applications" to "authenticated";

grant delete on table "public"."applications" to "service_role";

grant insert on table "public"."applications" to "service_role";

grant references on table "public"."applications" to "service_role";

grant select on table "public"."applications" to "service_role";

grant trigger on table "public"."applications" to "service_role";

grant truncate on table "public"."applications" to "service_role";

grant update on table "public"."applications" to "service_role";

grant delete on table "public"."jobs_posted" to "anon";

grant insert on table "public"."jobs_posted" to "anon";

grant references on table "public"."jobs_posted" to "anon";

grant select on table "public"."jobs_posted" to "anon";

grant trigger on table "public"."jobs_posted" to "anon";

grant truncate on table "public"."jobs_posted" to "anon";

grant update on table "public"."jobs_posted" to "anon";

grant delete on table "public"."jobs_posted" to "authenticated";

grant insert on table "public"."jobs_posted" to "authenticated";

grant references on table "public"."jobs_posted" to "authenticated";

grant select on table "public"."jobs_posted" to "authenticated";

grant trigger on table "public"."jobs_posted" to "authenticated";

grant truncate on table "public"."jobs_posted" to "authenticated";

grant update on table "public"."jobs_posted" to "authenticated";

grant delete on table "public"."jobs_posted" to "service_role";

grant insert on table "public"."jobs_posted" to "service_role";

grant references on table "public"."jobs_posted" to "service_role";

grant select on table "public"."jobs_posted" to "service_role";

grant trigger on table "public"."jobs_posted" to "service_role";

grant truncate on table "public"."jobs_posted" to "service_role";

grant update on table "public"."jobs_posted" to "service_role";


