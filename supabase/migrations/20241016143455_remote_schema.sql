drop policy "Enable insert for users based on user_id" on "public"."recruiters";

drop policy "Enable insert for authenticated users only" on "public"."users";

revoke delete on table "public"."users" from "anon";

revoke insert on table "public"."users" from "anon";

revoke references on table "public"."users" from "anon";

revoke select on table "public"."users" from "anon";

revoke trigger on table "public"."users" from "anon";

revoke truncate on table "public"."users" from "anon";

revoke update on table "public"."users" from "anon";

revoke delete on table "public"."users" from "authenticated";

revoke insert on table "public"."users" from "authenticated";

revoke references on table "public"."users" from "authenticated";

revoke select on table "public"."users" from "authenticated";

revoke trigger on table "public"."users" from "authenticated";

revoke truncate on table "public"."users" from "authenticated";

revoke update on table "public"."users" from "authenticated";

revoke delete on table "public"."users" from "service_role";

revoke insert on table "public"."users" from "service_role";

revoke references on table "public"."users" from "service_role";

revoke select on table "public"."users" from "service_role";

revoke trigger on table "public"."users" from "service_role";

revoke truncate on table "public"."users" from "service_role";

revoke update on table "public"."users" from "service_role";

alter table "public"."users" drop constraint "recruiters_id_fkey";

alter table "public"."users" drop constraint "users_applicant_id_fkey";

alter table "public"."users" drop constraint "users_recruiter_id_fkey";

alter table "public"."users" drop constraint "users_pkey1";

drop index if exists "public"."users_pkey1";

drop table "public"."users";

alter table "public"."applicants" alter column "id" drop default;

alter table "public"."recruiters" alter column "id" drop default;

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

grant insert on table "public"."applicants" to "supabase_auth_admin";

grant insert on table "public"."recruiters" to "supabase_auth_admin";

create policy "allow_supabase_service_role"
on "public"."applicants"
as permissive
for all
to anon, authenticated, supabase_auth_admin
using (true);


create policy "allow_supabase_service_role"
on "public"."recruiters"
as permissive
for all
to anon, authenticated, supabase_auth_admin
using (true);



