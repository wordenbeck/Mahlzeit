/**
 * Fix SanaMana ingredient data
 * Standardizes menge/einheit format:
 * - Zwiebeln: menge=1, einheit="Stk"
 * - Knoblauch: menge=X, einheit="Stk"
 * - Tomatenmark: menge in EL (≤2) or g (>2)
 */

-- Helper function to clean ingredient names and extract quantities
CREATE OR REPLACE FUNCTION clean_sanamana_ingredient(zutaten JSONB)
RETURNS JSONB AS $$
DECLARE
  result JSONB := '[]'::JSONB;
  item JSONB;
  name_lower TEXT;
  cleaned_name TEXT;
  cleaned_menge NUMERIC;
  cleaned_einheit TEXT;
BEGIN
  FOR item IN SELECT jsonb_array_elements(zutaten)
  LOOP
    name_lower := LOWER(COALESCE(item->>'name', ''));
    cleaned_name := COALESCE(item->>'name', '');
    cleaned_menge := (item->>'menge')::NUMERIC;
    cleaned_einheit := COALESCE(item->>'einheit', '');

    -- Zwiebel rules
    IF name_lower ILIKE '%zwiebel%' OR name_lower ILIKE '%rote%' THEN
      cleaned_name := CASE
        WHEN name_lower ILIKE '%rot%' THEN 'Rote Zwiebel'
        WHEN name_lower ILIKE '%gemüse%' OR name_lower ILIKE '%gemuesezwiebel%' THEN 'Gemüsezwiebel'
        WHEN name_lower ILIKE '%weiß%' OR name_lower ILIKE '%weiss%' THEN 'Weiße Zwiebel'
        ELSE 'Zwiebel'
      END;
      cleaned_menge := 1;
      cleaned_einheit := 'Stk';

    -- Knoblauch rules
    ELSIF name_lower ILIKE '%knoblauch%' OR name_lower ILIKE '%zehe%' THEN
      cleaned_name := 'Knoblauchzehe';
      cleaned_menge := COALESCE(cleaned_menge, 1);
      cleaned_einheit := 'Stk';

    -- Tomatenmark/Tomatensauce rules
    ELSIF name_lower ILIKE '%tomat%' THEN
      cleaned_name := 'Tomatenmark';
      -- If menge is in grams and > 30, keep as g, else convert to EL
      IF cleaned_einheit = 'g' AND cleaned_menge > 30 THEN
        cleaned_einheit := 'g';
      ELSE
        -- Default to EL for tomato paste
        cleaned_menge := COALESCE(cleaned_menge, 1);
        cleaned_einheit := 'EL';
      END IF;

    -- Default: keep name, remove units from string
    ELSE
      cleaned_name := REGEXP_REPLACE(
        cleaned_name,
        '\s*\(\s*\d+\s*(EL|g|ml)\s*\)\s*$',
        '',
        'i'
      );
      cleaned_name := TRIM(cleaned_name);
    END IF;

    -- Add cleaned item to result
    result := result || jsonb_build_object(
      'name', cleaned_name,
      'menge', cleaned_menge,
      'einheit', cleaned_einheit,
      'hinweis', item->>'hinweis'
    );
  END LOOP;

  RETURN result;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Apply cleanup to all SanaMana recipes
UPDATE recipes
SET zutaten = clean_sanamana_ingredient(zutaten)
WHERE source = 'sanamana';

-- Clean up function after use
DROP FUNCTION IF EXISTS clean_sanamana_ingredient(JSONB);
