alter table "public"."AI_summary" drop column "batch-processor_transcript_id";

alter table "public"."AI_summary" add column "batch_processor_transcript_id" text;


