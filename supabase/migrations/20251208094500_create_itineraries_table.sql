/*
  # Create itineraries table

  1. New Tables
    - `itineraries`
      - `id` (uuid, primary key) - Unique identifier for the itinerary
      - `user_id` (uuid, foreign key) - References auth.users
      - `destination` (text) - Destination name
      - `duration` (integer) - Number of days
      - `workflow_type` (text) - Type of workflow: 'plan' or 'surprise'
      - `itinerary_data` (jsonb) - Full itinerary JSON including days array
      - `created_at` (timestamptz) - When the itinerary was created
      - `updated_at` (timestamptz) - When the itinerary was last updated

  2. Security
    - Enable RLS on `itineraries` table
    - Add policy for users to read their own itineraries
    - Add policy for users to insert their own itineraries
    - Add policy for users to update their own itineraries
    - Add policy for users to delete their own itineraries
*/

CREATE TABLE IF NOT EXISTS itineraries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  destination text NOT NULL,
  duration integer NOT NULL,
  workflow_type text NOT NULL,
  itinerary_data jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE itineraries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own itineraries"
  ON itineraries
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own itineraries"
  ON itineraries
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own itineraries"
  ON itineraries
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own itineraries"
  ON itineraries
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS itineraries_user_id_idx ON itineraries(user_id);
CREATE INDEX IF NOT EXISTS itineraries_created_at_idx ON itineraries(created_at DESC);
