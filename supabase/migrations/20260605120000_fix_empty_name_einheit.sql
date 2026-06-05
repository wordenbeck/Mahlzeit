/**
 * Fix Parser-Artefakt: Zutaten mit leerem Namen, bei denen der Zutatname
 * faelschlich im Einheit-Feld steht (z.B. {name:"", einheit:"Avocado"}).
 * -> Name := Einheit, Einheit := 'Stk' (wenn Einheit keine echte Einheit ist).
 */

CREATE OR REPLACE FUNCTION fix_name_einheit_swap(zutaten JSONB)
RETURNS JSONB AS $$
DECLARE
  result JSONB := '[]'::JSONB;
  item JSONB;
  nm TEXT;
  eh TEXT;
  known_units TEXT[] := ARRAY['g','kg','ml','l','el','tl','prise','pck','pck.','bund',
    'scheibe','stk','stk.','stück','dose','becher','zehe','packung','msp','spritzer',
    'etwas','glas','kugel','blatt','cm','liter','nach geschmack',''];
BEGIN
  FOR item IN SELECT jsonb_array_elements(zutaten)
  LOOP
    nm := COALESCE(item->>'name', '');
    eh := COALESCE(item->>'einheit', '');

    -- Leerer Name + Einheit ist keine bekannte Einheit -> Einheit ist der Name
    IF TRIM(nm) = '' AND TRIM(eh) <> '' AND NOT (LOWER(TRIM(eh)) = ANY(known_units)) THEN
      result := result || jsonb_build_object(
        'name', eh,
        'menge', item->'menge',
        'einheit', 'Stk',
        'hinweis', item->>'hinweis'
      );
    ELSE
      result := result || item;
    END IF;
  END LOOP;

  RETURN result;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

UPDATE recipes
SET zutaten = fix_name_einheit_swap(zutaten)
WHERE zutaten::text ILIKE '%"name": ""%' OR zutaten::text ILIKE '%"name":""%';

DROP FUNCTION IF EXISTS fix_name_einheit_swap(JSONB);
