alter table "public"."applications" drop constraint "applications_AI_summary_fkey";

alter table "public"."AI_summary" add column "application_id" uuid;

alter table "public"."AI_summary" add column "recording_id" text;

alter table "public"."AI_summary" add column "room_name" text;

alter table "public"."applications" drop column "AI_summary";

alter table "public"."AI_summary" add constraint "AI_summary_application_id_fkey" FOREIGN KEY (application_id) REFERENCES applications(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."AI_summary" validate constraint "AI_summary_application_id_fkey";



