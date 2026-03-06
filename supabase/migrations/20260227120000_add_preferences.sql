-- Add preferences column to profiles
ALTER TABLE public.profiles
ADD COLUMN preferences text[] NOT NULL DEFAULT '{}';

-- Allow users to update their own preferences
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can update own preferences" ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);
