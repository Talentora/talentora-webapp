create policy "Enable read access for all users"
on "public"."applicants"
as permissive
for select
to public
using (true);


create policy "Select Jobs"
on "public"."jobs"
as permissive
for select
to public
using (true);



