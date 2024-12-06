create policy "Enable insert for authenticated users only"
on "public"."applications"
as permissive
for all
to authenticated
using (true);




