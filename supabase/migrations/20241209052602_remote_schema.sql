alter table "public"."AI_summary" drop column "interview_summary";

alter table "public"."AI_summary" add column "batch-processor_transcript_id" text;

alter table "public"."AI_summary" add column "overall_summary" jsonb;

alter table "public"."AI_summary" add column "transcript_summary" text;

alter table "public"."applications" disable row level security;


