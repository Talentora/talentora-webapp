drop policy "Can update own user data." on "public"."users";

drop policy "Can view own user data." on "public"."users";

drop policy "Enable insert for users based on user_id" on "public"."users";

alter table "public"."users" drop constraint "users_company_id_fkey";

alter table "public"."users" drop constraint "users_id_fkey";

alter table "public"."jobs_posted" drop constraint "jobs_posted_user_id_fkey";

alter table "public"."users" drop constraint "users_pkey";

drop index if exists "public"."users_pkey";

create table "public"."recruiters" (
    "id" uuid not null,
    "avatar_url" text,
    "billing_address" jsonb,
    "payment_method" jsonb,
    "email" text,
    "company_id" uuid,
    "role" role not null default 'recruiter'::role,
    "full_name" text
);


alter table "public"."recruiters" enable row level security;

alter table "public"."companies" alter column "id" set default gen_random_uuid();

alter table "public"."users" drop column "avatar_url";

alter table "public"."users" drop column "billing_address";

alter table "public"."users" drop column "company_id";

alter table "public"."users" drop column "email";

alter table "public"."users" drop column "full_name";

alter table "public"."users" drop column "payment_method";

alter table "public"."users" drop column "role";

alter table "public"."users" add column "applicant_id" uuid;

alter table "public"."users" add column "recruiter_id" uuid;

alter table "public"."users" alter column "id" set default gen_random_uuid();

CREATE UNIQUE INDEX companies_subscription_id_key ON public.companies USING btree (subscription_id);

CREATE UNIQUE INDEX users_pkey1 ON public.users USING btree (id);

CREATE UNIQUE INDEX users_pkey ON public.recruiters USING btree (id);

alter table "public"."recruiters" add constraint "users_pkey" PRIMARY KEY using index "users_pkey";

alter table "public"."users" add constraint "users_pkey1" PRIMARY KEY using index "users_pkey1";

alter table "public"."companies" add constraint "companies_subscription_id_key" UNIQUE using index "companies_subscription_id_key";

alter table "public"."recruiters" add constraint "users_company_id_fkey" FOREIGN KEY (company_id) REFERENCES companies(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."recruiters" validate constraint "users_company_id_fkey";

alter table "public"."recruiters" add constraint "users_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) not valid;

alter table "public"."recruiters" validate constraint "users_id_fkey";

alter table "public"."users" add constraint "users_applicant_id_fkey" FOREIGN KEY (applicant_id) REFERENCES applicants(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."users" validate constraint "users_applicant_id_fkey";

alter table "public"."users" add constraint "users_recruiter_id_fkey" FOREIGN KEY (recruiter_id) REFERENCES recruiters(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."users" validate constraint "users_recruiter_id_fkey";

alter table "public"."jobs_posted" add constraint "jobs_posted_user_id_fkey" FOREIGN KEY (user_id) REFERENCES recruiters(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."jobs_posted" validate constraint "jobs_posted_user_id_fkey";

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


create policy "Enable insert for users based on user_id"
on "public"."recruiters"
as permissive
for insert
to public
with check ((( SELECT auth.uid() AS uid) = id));



