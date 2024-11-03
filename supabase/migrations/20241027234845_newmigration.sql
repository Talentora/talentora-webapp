create type "public"."pricing_plan_interval" as enum ('day', 'week', 'month', 'year');

create type "public"."pricing_type" as enum ('one_time', 'recurring');

create type "public"."role" as enum ('recruiter', 'candidate');

create type "public"."subscription_status" as enum ('trialing', 'active', 'canceled', 'incomplete', 'incomplete_expired', 'past_due', 'unpaid', 'paused');

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

create table "public"."applicants" (
    "id" uuid not null,
    "harvest_applicants" bigint
);


alter table "public"."applicants" enable row level security;

create table "public"."applications" (
    "created_at" timestamp with time zone not null default now(),
    "AI_summary" uuid,
    "applicant_id" uuid not null,
    "job_id" uuid not null,
    "harvest_applications" bigint
);


alter table "public"."applications" enable row level security;

create table "public"."companies" (
    "name" text not null,
    "location" text,
    "industry" text,
    "description" text,
    "email_extension" text,
    "website_url" text,
    "id" uuid not null default gen_random_uuid(),
    "subscription_id" text
);


alter table "public"."companies" enable row level security;

create table "public"."customers" (
    "id" uuid not null,
    "stripe_customer_id" text
);


alter table "public"."customers" enable row level security;

create table "public"."jobs" (
    "id" uuid not null default gen_random_uuid(),
    "company_id" uuid,
    "harvest_jobs" bigint,
    "AIconfig_id" uuid
);


alter table "public"."jobs" enable row level security;

create table "public"."prices" (
    "id" text not null,
    "product_id" text,
    "active" boolean,
    "description" text,
    "unit_amount" bigint,
    "currency" text,
    "type" pricing_type,
    "interval" pricing_plan_interval,
    "interval_count" integer,
    "trial_period_days" integer,
    "metadata" jsonb
);


alter table "public"."prices" enable row level security;

create table "public"."products" (
    "id" text not null,
    "active" boolean,
    "name" text,
    "description" text,
    "image" text,
    "metadata" jsonb
);


alter table "public"."products" enable row level security;

create table "public"."recruiters" (
    "id" uuid not null,
    "avatar_url" text,
    "billing_address" jsonb,
    "payment_method" jsonb,
    "company_id" uuid,
    "harvest_recruiters" integer
);


alter table "public"."recruiters" enable row level security;

create table "public"."subscriptions" (
    "id" text not null,
    "user_id" uuid not null,
    "status" subscription_status,
    "metadata" jsonb,
    "price_id" text,
    "quantity" integer,
    "cancel_at_period_end" boolean,
    "created" timestamp with time zone not null default timezone('utc'::text, now()),
    "current_period_start" timestamp with time zone not null default timezone('utc'::text, now()),
    "current_period_end" timestamp with time zone not null default timezone('utc'::text, now()),
    "ended_at" timestamp with time zone default timezone('utc'::text, now()),
    "cancel_at" timestamp with time zone default timezone('utc'::text, now()),
    "canceled_at" timestamp with time zone default timezone('utc'::text, now()),
    "trial_start" timestamp with time zone default timezone('utc'::text, now()),
    "trial_end" timestamp with time zone default timezone('utc'::text, now())
);


alter table "public"."subscriptions" enable row level security;

CREATE UNIQUE INDEX "AI_config_pkey" ON public."AI_config" USING btree (id);

CREATE UNIQUE INDEX "AI_summary_pkey" ON public."AI_summary" USING btree (id);

CREATE UNIQUE INDEX applicants_harvest_applicants_key ON public.applicants USING btree (harvest_applicants);

CREATE UNIQUE INDEX applicants_pkey ON public.applicants USING btree (id);

CREATE UNIQUE INDEX applications_harvest_applications_key ON public.applications USING btree (harvest_applications);

CREATE UNIQUE INDEX applications_pkey ON public.applications USING btree (job_id, applicant_id);

CREATE UNIQUE INDEX companies_pkey ON public.companies USING btree (id);

CREATE UNIQUE INDEX companies_subscription_id_key ON public.companies USING btree (subscription_id);

CREATE UNIQUE INDEX customers_pkey ON public.customers USING btree (id);

CREATE UNIQUE INDEX jobs_harvest_jobs_key ON public.jobs USING btree (harvest_jobs);

CREATE UNIQUE INDEX jobs_pkey ON public.jobs USING btree (id);

CREATE UNIQUE INDEX prices_pkey ON public.prices USING btree (id);

CREATE UNIQUE INDEX products_pkey ON public.products USING btree (id);

CREATE UNIQUE INDEX recruiters_harvest_recruiters_key ON public.recruiters USING btree (harvest_recruiters);

CREATE UNIQUE INDEX subscriptions_pkey ON public.subscriptions USING btree (id);

CREATE UNIQUE INDEX users_pkey ON public.recruiters USING btree (id);

alter table "public"."AI_config" add constraint "AI_config_pkey" PRIMARY KEY using index "AI_config_pkey";

alter table "public"."AI_summary" add constraint "AI_summary_pkey" PRIMARY KEY using index "AI_summary_pkey";

alter table "public"."applicants" add constraint "applicants_pkey" PRIMARY KEY using index "applicants_pkey";

alter table "public"."applications" add constraint "applications_pkey" PRIMARY KEY using index "applications_pkey";

alter table "public"."companies" add constraint "companies_pkey" PRIMARY KEY using index "companies_pkey";

alter table "public"."customers" add constraint "customers_pkey" PRIMARY KEY using index "customers_pkey";

alter table "public"."jobs" add constraint "jobs_pkey" PRIMARY KEY using index "jobs_pkey";

alter table "public"."prices" add constraint "prices_pkey" PRIMARY KEY using index "prices_pkey";

alter table "public"."products" add constraint "products_pkey" PRIMARY KEY using index "products_pkey";

alter table "public"."recruiters" add constraint "users_pkey" PRIMARY KEY using index "users_pkey";

alter table "public"."subscriptions" add constraint "subscriptions_pkey" PRIMARY KEY using index "subscriptions_pkey";

alter table "public"."applicants" add constraint "applicants_harvest_applicants_key" UNIQUE using index "applicants_harvest_applicants_key";

alter table "public"."applications" add constraint "applications_AI_summary_fkey" FOREIGN KEY ("AI_summary") REFERENCES "AI_summary"(id) not valid;

alter table "public"."applications" validate constraint "applications_AI_summary_fkey";

alter table "public"."applications" add constraint "applications_applicant_id_fkey" FOREIGN KEY (applicant_id) REFERENCES applicants(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."applications" validate constraint "applications_applicant_id_fkey";

alter table "public"."applications" add constraint "applications_harvest_applications_key" UNIQUE using index "applications_harvest_applications_key";

alter table "public"."applications" add constraint "applications_job_id_fkey" FOREIGN KEY (job_id) REFERENCES jobs(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."applications" validate constraint "applications_job_id_fkey";

alter table "public"."companies" add constraint "companies_subscription_id_fkey" FOREIGN KEY (subscription_id) REFERENCES subscriptions(id) not valid;

alter table "public"."companies" validate constraint "companies_subscription_id_fkey";

alter table "public"."companies" add constraint "companies_subscription_id_key" UNIQUE using index "companies_subscription_id_key";

alter table "public"."customers" add constraint "customers_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) not valid;

alter table "public"."customers" validate constraint "customers_id_fkey";

alter table "public"."jobs" add constraint "jobs_AIconfig_id_fkey" FOREIGN KEY ("AIconfig_id") REFERENCES "AI_config"(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."jobs" validate constraint "jobs_AIconfig_id_fkey";

alter table "public"."jobs" add constraint "jobs_company_id_fkey" FOREIGN KEY (company_id) REFERENCES companies(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."jobs" validate constraint "jobs_company_id_fkey";

alter table "public"."jobs" add constraint "jobs_harvest_jobs_key" UNIQUE using index "jobs_harvest_jobs_key";

alter table "public"."prices" add constraint "prices_currency_check" CHECK ((char_length(currency) = 3)) not valid;

alter table "public"."prices" validate constraint "prices_currency_check";

alter table "public"."prices" add constraint "prices_product_id_fkey" FOREIGN KEY (product_id) REFERENCES products(id) not valid;

alter table "public"."prices" validate constraint "prices_product_id_fkey";

alter table "public"."recruiters" add constraint "recruiters_harvest_recruiters_key" UNIQUE using index "recruiters_harvest_recruiters_key";

alter table "public"."recruiters" add constraint "users_company_id_fkey" FOREIGN KEY (company_id) REFERENCES companies(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."recruiters" validate constraint "users_company_id_fkey";

alter table "public"."subscriptions" add constraint "subscriptions_price_id_fkey" FOREIGN KEY (price_id) REFERENCES prices(id) not valid;

alter table "public"."subscriptions" validate constraint "subscriptions_price_id_fkey";

alter table "public"."subscriptions" add constraint "subscriptions_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."subscriptions" validate constraint "subscriptions_user_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    IF NEW.raw_user_meta_data->>'role' IS NULL THEN
        RAISE EXCEPTION 'No role found in raw_user_meta_data for user: %', NEW.id;
    END IF;

    IF NEW.raw_user_meta_data->>'role' = 'recruiter' THEN
        RAISE NOTICE 'Creating recruiter for user: %', NEW.id;
        INSERT INTO public.recruiters (id) VALUES (NEW.id);
    ELSIF NEW.raw_user_meta_data->>'role' = 'applicant' THEN
        RAISE NOTICE 'Creating applicant for user: %', NEW.id;
        INSERT INTO public.applicants (id) VALUES (NEW.id);
    ELSE
        RAISE EXCEPTION 'Invalid role: %, for user: %', NEW.raw_user_meta_data->>'role', NEW.id;
    END IF;
    RETURN NEW;
END;
$function$
;

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

grant insert on table "public"."applicants" to "supabase_auth_admin";

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

grant delete on table "public"."customers" to "anon";

grant insert on table "public"."customers" to "anon";

grant references on table "public"."customers" to "anon";

grant select on table "public"."customers" to "anon";

grant trigger on table "public"."customers" to "anon";

grant truncate on table "public"."customers" to "anon";

grant update on table "public"."customers" to "anon";

grant delete on table "public"."customers" to "authenticated";

grant insert on table "public"."customers" to "authenticated";

grant references on table "public"."customers" to "authenticated";

grant select on table "public"."customers" to "authenticated";

grant trigger on table "public"."customers" to "authenticated";

grant truncate on table "public"."customers" to "authenticated";

grant update on table "public"."customers" to "authenticated";

grant delete on table "public"."customers" to "service_role";

grant insert on table "public"."customers" to "service_role";

grant references on table "public"."customers" to "service_role";

grant select on table "public"."customers" to "service_role";

grant trigger on table "public"."customers" to "service_role";

grant truncate on table "public"."customers" to "service_role";

grant update on table "public"."customers" to "service_role";

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

grant delete on table "public"."prices" to "anon";

grant insert on table "public"."prices" to "anon";

grant references on table "public"."prices" to "anon";

grant select on table "public"."prices" to "anon";

grant trigger on table "public"."prices" to "anon";

grant truncate on table "public"."prices" to "anon";

grant update on table "public"."prices" to "anon";

grant delete on table "public"."prices" to "authenticated";

grant insert on table "public"."prices" to "authenticated";

grant references on table "public"."prices" to "authenticated";

grant select on table "public"."prices" to "authenticated";

grant trigger on table "public"."prices" to "authenticated";

grant truncate on table "public"."prices" to "authenticated";

grant update on table "public"."prices" to "authenticated";

grant delete on table "public"."prices" to "service_role";

grant insert on table "public"."prices" to "service_role";

grant references on table "public"."prices" to "service_role";

grant select on table "public"."prices" to "service_role";

grant trigger on table "public"."prices" to "service_role";

grant truncate on table "public"."prices" to "service_role";

grant update on table "public"."prices" to "service_role";

grant delete on table "public"."products" to "anon";

grant insert on table "public"."products" to "anon";

grant references on table "public"."products" to "anon";

grant select on table "public"."products" to "anon";

grant trigger on table "public"."products" to "anon";

grant truncate on table "public"."products" to "anon";

grant update on table "public"."products" to "anon";

grant delete on table "public"."products" to "authenticated";

grant insert on table "public"."products" to "authenticated";

grant references on table "public"."products" to "authenticated";

grant select on table "public"."products" to "authenticated";

grant trigger on table "public"."products" to "authenticated";

grant truncate on table "public"."products" to "authenticated";

grant update on table "public"."products" to "authenticated";

grant delete on table "public"."products" to "service_role";

grant insert on table "public"."products" to "service_role";

grant references on table "public"."products" to "service_role";

grant select on table "public"."products" to "service_role";

grant trigger on table "public"."products" to "service_role";

grant truncate on table "public"."products" to "service_role";

grant update on table "public"."products" to "service_role";

grant delete on table "public"."recruiters" to "anon";

grant insert on table "public"."recruiters" to "anon";

grant references on table "public"."recruiters" to "anon";

grant select on table "public"."recruiters" to "anon";

grant trigger on table "public"."recruiters" to "anon";

grant truncate on table "public"."recruiters" to "anon";

grant update on table "public"."recruiters" to "anon";

grant delete on table "public"."recruiters" to "authenticated";

grant insert on table "public"."recruiters" to "authenticated";

grant references on table "public"."recruiters" to "authenticated";

grant select on table "public"."recruiters" to "authenticated";

grant trigger on table "public"."recruiters" to "authenticated";

grant truncate on table "public"."recruiters" to "authenticated";

grant update on table "public"."recruiters" to "authenticated";

grant delete on table "public"."recruiters" to "service_role";

grant insert on table "public"."recruiters" to "service_role";

grant references on table "public"."recruiters" to "service_role";

grant select on table "public"."recruiters" to "service_role";

grant trigger on table "public"."recruiters" to "service_role";

grant truncate on table "public"."recruiters" to "service_role";

grant update on table "public"."recruiters" to "service_role";

grant insert on table "public"."recruiters" to "supabase_auth_admin";

grant delete on table "public"."subscriptions" to "anon";

grant insert on table "public"."subscriptions" to "anon";

grant references on table "public"."subscriptions" to "anon";

grant select on table "public"."subscriptions" to "anon";

grant trigger on table "public"."subscriptions" to "anon";

grant truncate on table "public"."subscriptions" to "anon";

grant update on table "public"."subscriptions" to "anon";

grant delete on table "public"."subscriptions" to "authenticated";

grant insert on table "public"."subscriptions" to "authenticated";

grant references on table "public"."subscriptions" to "authenticated";

grant select on table "public"."subscriptions" to "authenticated";

grant trigger on table "public"."subscriptions" to "authenticated";

grant truncate on table "public"."subscriptions" to "authenticated";

grant update on table "public"."subscriptions" to "authenticated";

grant delete on table "public"."subscriptions" to "service_role";

grant insert on table "public"."subscriptions" to "service_role";

grant references on table "public"."subscriptions" to "service_role";

grant select on table "public"."subscriptions" to "service_role";

grant trigger on table "public"."subscriptions" to "service_role";

grant truncate on table "public"."subscriptions" to "service_role";

grant update on table "public"."subscriptions" to "service_role";

create policy "allow_supabase_service_role"
on "public"."applicants"
as permissive
for all
to anon, authenticated, supabase_auth_admin
using (true);


create policy "Enable insert for authenticated users only"
on "public"."jobs"
as permissive
for insert
to authenticated
with check (true);


create policy "Select Jobs"
on "public"."jobs"
as permissive
for select
to public
using (true);


create policy "Allow public read-only access."
on "public"."prices"
as permissive
for select
to public
using (true);


create policy "Allow public read-only access."
on "public"."products"
as permissive
for select
to public
using (true);


create policy "Can update own user data."
on "public"."recruiters"
as permissive
for update
to public
using ((auth.uid() = id));


create policy "Can view own user data."
on "public"."recruiters"
as permissive
for select
to public
using ((auth.uid() = id));


create policy "allow_supabase_service_role"
on "public"."recruiters"
as permissive
for all
to anon, authenticated, supabase_auth_admin
using (true);


create policy "Can only view own subs data."
on "public"."subscriptions"
as permissive
for select
to public
using ((auth.uid() = user_id));




