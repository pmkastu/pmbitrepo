-- Update trigger function to populate preferences from user metadata

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, preferences)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data ->> 'name', ''),
    COALESCE(
      (NEW.raw_user_meta_data -> 'preferences')::text[],
      '{}'::text[]
    )
  );
  RETURN NEW;
END;
$$;
