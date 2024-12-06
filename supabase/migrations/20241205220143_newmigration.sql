set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$BEGIN
    IF NEW.raw_user_meta_data->>'role' IS NULL THEN
        RAISE EXCEPTION 'No role found in raw_user_meta_data for user: %', NEW.id;
    END IF;
    IF NEW.raw_user_meta_data->>'role' = 'recruiter' THEN
        RAISE NOTICE 'Creating recruiter for user: %', NEW.id;
        IF NEW.raw_user_meta_data->>'company_id' IS NULL THEN
            INSERT INTO public.recruiters (id)
            VALUES (NEW.id);
        ELSE
            INSERT INTO public.recruiters (id, company_id)
VALUES (NEW.id, (NEW.raw_user_meta_data->>'company_id')::uuid);

        END IF;
    ELSIF NEW.raw_user_meta_data->>'role' = 'applicant' THEN
        RAISE NOTICE 'Creating applicant for user: %', NEW.id;
        INSERT INTO public.applicants (id) VALUES (NEW.id);
    ELSE
        RAISE EXCEPTION 'Invalid role: %, for user: %', NEW.raw_user_meta_data->>'role', NEW.id;
    END IF;
    RETURN NEW;
END;$function$
;



