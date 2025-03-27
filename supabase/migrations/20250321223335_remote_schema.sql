alter table "public"."applicants" drop constraint "fk_user_id";

alter table "public"."applications" drop constraint "applications_applicant_id_fkey";

alter table "public"."applicants" drop column "user_id";

alter table "public"."applications" alter column "applicant_id" drop not null;

alter table "public"."applicants" add constraint "fk_applicants_auth_users" FOREIGN KEY (id) REFERENCES auth.users(id) not valid;

alter table "public"."applicants" validate constraint "fk_applicants_auth_users";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$DECLARE
  v_company_uuid uuid;
  v_provider_company_id text;
BEGIN
  -- Check if the user signed in via SSO by examining raw_app_meta_data->>'provider'
  IF NEW.raw_app_meta_data->>'provider' LIKE 'sso:%' THEN
    -- Update raw_user_meta_data to add custom_role "recruiter"
    NEW.raw_user_meta_data := jsonb_set(
      COALESCE(NEW.raw_user_meta_data, '{}'::jsonb),
      '{custom_role}',
      '"recruiter"',
      true
    );
    RAISE NOTICE 'SSO user detected (provider: %). Setting custom_role to recruiter.', NEW.raw_app_meta_data->>'provider';

    -- Attempt to extract an external company id:
    v_provider_company_id := NEW.raw_user_meta_data->>'provider_company_id';
    IF v_provider_company_id IS NULL THEN
      -- If not provided, extract the id from the provider string (remove the "sso:" prefix)
      v_provider_company_id := substring(NEW.raw_app_meta_data->>'provider' from 'sso:(.*)');
    END IF;

    IF v_provider_company_id IS NOT NULL THEN
      -- Look for an existing company record matching the external provider id.
      SELECT id INTO v_company_uuid
      FROM public.companies
      WHERE provider_id = v_provider_company_id;
      
      IF NOT FOUND THEN
        RAISE NOTICE 'No company found with provider_id %, creating new company.', v_provider_company_id;
        INSERT INTO public.companies (id, name, provider_id)
        VALUES (
          gen_random_uuid(),
          COALESCE(NEW.raw_app_meta_data->>'company_name', 'New Company'),
          v_provider_company_id
        )
        RETURNING id INTO v_company_uuid;
      END IF;
    ELSE
      -- If no external company id is provided, create a new company.
      v_company_uuid := gen_random_uuid();
      RAISE NOTICE 'No external company id provided; creating a new company with id: %', v_company_uuid;
      INSERT INTO public.companies (id, name)
      VALUES (
        v_company_uuid,
        COALESCE(NEW.raw_app_meta_data->>'company_name', 'New Company')
      );
    END IF;
    
    -- Insert the new user into the recruiters table, associating with the determined company.
    INSERT INTO public.recruiters (id, company_id)
    VALUES (NEW.id, v_company_uuid);

    NEW.raw_user_meta_data := jsonb_set(
      COALESCE(NEW.raw_user_meta_data, '{}'::jsonb),
      '{role}',
      '"recruiter"',
      true
    );
    
  ELSE
    -- For an email or OAuth signin, update raw_user_meta_data with custom_role "applicant"
    NEW.raw_user_meta_data := jsonb_set(
      COALESCE(NEW.raw_user_meta_data, '{}'::jsonb),
      '{role}',
      '"applicant"',
      true
    );
   RAISE NOTICE 'Non-SSO user (email or oauth) detected. Setting custom_role to applicant.';
INSERT INTO public.applicants (id, merge_candidate_id)
VALUES (NEW.id, '{}');
END IF;


  RETURN NEW;
END;$function$
;


