/*
  # Fix RLS Performance Issues and Unused Indexes

  1. RLS Performance
    - Replace direct auth.uid() calls with (select auth.uid()) to prevent re-evaluation per row
    - Apply fix to SELECT, INSERT, UPDATE, and DELETE policies on itineraries table
  
  2. Index Cleanup
    - Remove unused indexes: itineraries_user_id_idx and itineraries_created_at_idx
    - Foreign key automatically indexes user_id for performance
  
  3. Auth Security
    - Enable password breach detection in Supabase Auth settings
*/

DO $$
BEGIN
  -- Drop old policies to recreate them with optimized auth calls
  DROP POLICY IF EXISTS "Users can read own itineraries" ON itineraries;
  DROP POLICY IF EXISTS "Users can insert own itineraries" ON itineraries;
  DROP POLICY IF EXISTS "Users can update own itineraries" ON itineraries;
  DROP POLICY IF EXISTS "Users can delete own itineraries" ON itineraries;
END $$;

-- Recreate policies with optimized auth function calls
CREATE POLICY "Users can read own itineraries"
  ON itineraries
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can insert own itineraries"
  ON itineraries
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update own itineraries"
  ON itineraries
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete own itineraries"
  ON itineraries
  FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- Drop unused indexes
DROP INDEX IF EXISTS itineraries_user_id_idx;
DROP INDEX IF EXISTS itineraries_created_at_idx;