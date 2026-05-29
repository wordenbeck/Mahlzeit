import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !supabaseKey) {
    return new Response(JSON.stringify({ error: "Service role key not available" }), {
      status: 500,
    });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  // Execute migration
  const { error } = await supabase.rpc("sql", {
    query: `
      ALTER TABLE recipes ADD COLUMN is_shared boolean DEFAULT true NOT NULL;
      UPDATE recipes SET is_shared = true;
      DROP POLICY IF EXISTS "recipes_select_policy" ON recipes;
      DROP POLICY IF EXISTS "recipes_insert_policy" ON recipes;
      DROP POLICY IF EXISTS "recipes_update_policy" ON recipes;
      DROP POLICY IF EXISTS "recipes_delete_policy" ON recipes;

      CREATE POLICY "recipes_select_policy" ON recipes
        FOR SELECT
        USING (workspace_id = (SELECT workspace_id FROM profiles WHERE id = auth.uid()) OR is_shared = true);

      CREATE POLICY "recipes_insert_policy" ON recipes
        FOR INSERT
        WITH CHECK (workspace_id = (SELECT workspace_id FROM profiles WHERE id = auth.uid()));

      CREATE POLICY "recipes_update_policy" ON recipes
        FOR UPDATE
        USING (workspace_id = (SELECT workspace_id FROM profiles WHERE id = auth.uid()))
        WITH CHECK (workspace_id = (SELECT workspace_id FROM profiles WHERE id = auth.uid()));

      CREATE POLICY "recipes_delete_policy" ON recipes
        FOR DELETE
        USING (workspace_id = (SELECT workspace_id FROM profiles WHERE id = auth.uid()));
    `,
  });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
});
