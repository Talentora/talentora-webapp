alter type "public"."recruiter_status" rename to "recruiter_status__old_version_to_be_dropped";

create type "public"."recruiter_status" as enum ('active', 'pending_invite', 'invite_expired');

alter table "public"."recruiters" alter column status type "public"."recruiter_status" using status::text::"public"."recruiter_status";

drop type "public"."recruiter_status__old_version_to_be_dropped";


