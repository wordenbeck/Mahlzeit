-- =====================================================================
-- Storage-Bucket recipe-images
-- Pfad-Konvention: recipe-images/{workspace_id}/{recipe_id}.{ext}
-- =====================================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'recipe-images',
  'recipe-images',
  true,                                       -- public read damit <img src> direkt funktioniert
  5 * 1024 * 1024,                            -- 5 MB pro File
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- =====================================================================
-- Storage-Policies — workspace-scoped Schreibzugriff
-- =====================================================================

-- Lesen: jeder (Bucket ist public)
drop policy if exists "recipe_images_public_read" on storage.objects;
create policy "recipe_images_public_read"
  on storage.objects for select
  using (bucket_id = 'recipe-images');

-- Schreiben: nur in eigenen Workspace-Ordner
drop policy if exists "recipe_images_workspace_insert" on storage.objects;
create policy "recipe_images_workspace_insert"
  on storage.objects for insert
  with check (
    bucket_id = 'recipe-images'
    and (storage.foldername(name))[1] = current_workspace_id()::text
  );

-- Updaten / Löschen: nur eigene Workspace-Files
drop policy if exists "recipe_images_workspace_update" on storage.objects;
create policy "recipe_images_workspace_update"
  on storage.objects for update
  using (
    bucket_id = 'recipe-images'
    and (storage.foldername(name))[1] = current_workspace_id()::text
  );

drop policy if exists "recipe_images_workspace_delete" on storage.objects;
create policy "recipe_images_workspace_delete"
  on storage.objects for delete
  using (
    bucket_id = 'recipe-images'
    and (storage.foldername(name))[1] = current_workspace_id()::text
  );
