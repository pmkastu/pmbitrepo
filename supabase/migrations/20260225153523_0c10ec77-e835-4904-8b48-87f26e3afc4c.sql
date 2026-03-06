
-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT DEFAULT '',
  email TEXT DEFAULT '',
  subscription_type TEXT NOT NULL DEFAULT 'free',
  streak_count INT NOT NULL DEFAULT 0,
  last_visit_date TEXT DEFAULT '',
  quiz_count INT NOT NULL DEFAULT 0,
  daily_goal_progress INT NOT NULL DEFAULT 0,
  daily_goal_target INT NOT NULL DEFAULT 3,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data ->> 'name', '')
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create user_bite_progress table
CREATE TABLE public.user_bite_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  bite_id INT NOT NULL,
  confidence TEXT NOT NULL DEFAULT 'confused',
  next_review_date DATE NOT NULL DEFAULT CURRENT_DATE,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.user_bite_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own bite progress" ON public.user_bite_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own bite progress" ON public.user_bite_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own bite progress" ON public.user_bite_progress FOR UPDATE USING (auth.uid() = user_id);

-- Create quiz_attempts table
CREATE TABLE public.quiz_attempts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  bite_id INT NOT NULL,
  selected_answer INT NOT NULL,
  is_correct BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own quiz attempts" ON public.quiz_attempts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own quiz attempts" ON public.quiz_attempts FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create challenges table
CREATE TABLE public.challenges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  challenger_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  bite_id INT NOT NULL,
  challenger_score INT NOT NULL DEFAULT 0,
  responder_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  responder_score INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Challenger can create challenges" ON public.challenges FOR INSERT WITH CHECK (auth.uid() = challenger_id);
CREATE POLICY "Participants can view challenges" ON public.challenges FOR SELECT USING (auth.uid() = challenger_id OR auth.uid() = responder_id);
CREATE POLICY "Responder can update challenge" ON public.challenges FOR UPDATE USING (auth.uid() = responder_id OR (responder_id IS NULL));

-- Create ai_cache table
CREATE TABLE public.ai_cache (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  bite_id INT NOT NULL UNIQUE,
  response_text TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.ai_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read ai_cache" ON public.ai_cache FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can insert ai_cache" ON public.ai_cache FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
