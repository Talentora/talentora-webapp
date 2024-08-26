alter table "public"."jobs" drop column "Department";

alter table "public"."jobs" add column "department" text default 'Marketing'::text;


