-- Recipe-Type: Hauptgericht / Snack / Dessert / Frühstück / Beilage / Getränk
-- Wird in der UI als prominente Kategorie genutzt (Filter + Magic-Fill-Hint).

alter table recipes
  add column if not exists recipe_type text not null default 'hauptgericht';

-- Index für Filter-Performance
create index if not exists idx_recipes_type on recipes(workspace_id, recipe_type);

-- Backfill: bestehende Rezepte heuristisch aus kategorie[] ableiten
update recipes
set recipe_type = case
  when 'dessert' = any(kategorie) then 'dessert'
  when 'snack' = any(kategorie) then 'snack'
  when 'fruehstueck' = any(kategorie) then 'fruehstueck'
  when 'getraenk' = any(kategorie) then 'getraenk'
  when 'beilage' = any(kategorie) then 'beilage'
  else 'hauptgericht'
end
where recipe_type = 'hauptgericht';
