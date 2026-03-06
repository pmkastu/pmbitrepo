import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// CORS headers used by the function. Supabase may perform a preflight request (OPTIONS)
// so we need to return an OK status and include all necessary allow-* directives.
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Max-Age": "86400",
};

// Fallback insights based on categories and types
const fallbackInsights: Record<string, Record<string, string>> = {
  "Technical": {
    "quiz": "This technical concept requires understanding of fundamental principles. Focus on how the core mechanisms work and practice applying them in different scenarios. Real-world applications often combine multiple technical concepts to solve complex problems.",
    "fact": "This is an important technical fact to remember. Understanding the 'why' behind this fact will help you apply it more effectively in your projects. Consider how this relates to other technical concepts you've learned.",
    "tip": "This practical tip can significantly improve your technical workflow. The key is to experiment with it and find ways to integrate it into your daily development practices. Small optimizations compound over time."
  },
  "Soft Skills": {
    "quiz": "Soft skills like this are developed through conscious practice and reflection. Think about how this skill applies to your current interactions and relationships. The most effective learners regularly assess and improve their interpersonal abilities.",
    "fact": "Understanding this aspect of human behavior or communication can greatly enhance your effectiveness. Consider observing how this plays out in your own experiences and those around you.",
    "tip": "Implementing this tip consistently will improve your interpersonal effectiveness. Start with small, deliberate applications and gradually build the habit. Notice the positive changes in your interactions."
  },
  "General Knowledge": {
    "quiz": "This general knowledge concept enriches your understanding of the world. The best way to retain it is through repeated exposure and relating it to other knowledge you already have. Try to find real-world connections.",
    "fact": "This fact is interesting and useful for general understanding. Explore how it connects to other domains of knowledge. Curiosity-driven learning often leads to deeper understanding.",
    "tip": "This useful tip can be applied in various life situations. The key to remembering it is to use it actively whenever relevant. Share it with others to reinforce your own understanding."
  }
};

// Cache for knowledge bites
let cachedBites: any[] | null = null;

async function loadKnowledgeBites(): Promise<any[]> {
  if (cachedBites) return cachedBites;
  
  try {
    const response = await fetch("https://raw.githubusercontent.com/your-username/your-repo/main/public/data/knowledge_bites.json");
    if (response.ok) {
      cachedBites = await response.json();
      return cachedBites;
    }
  } catch (_err) {
    console.warn("Failed to load knowledge_bites.json from remote");
  }
  
  return [];
}

function getFallbackInsight(content: string, category: string, type: string, bites: any[]): string {
  // Try to find matching bite in knowledge_bites.json
  const matchingBite = bites.find(bite => 
    bite.content.toLowerCase() === content.toLowerCase() && 
    bite.explanation
  );
  
  if (matchingBite && matchingBite.explanation) {
    return matchingBite.explanation;
  }
  
  // Fallback to generic insights
  const categoryKey = Object.keys(fallbackInsights).find(
    key => key.toLowerCase() === category.toLowerCase()
  ) || "General Knowledge";
  
  const typeKey = type in fallbackInsights[categoryKey] ? type : "fact";
  return fallbackInsights[categoryKey][typeKey];
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    // Return a 204 No Content for preflight
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    const { content, category, type } = await req.json();
    
    // Try Groq API first
    const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY");
    
    if (GROQ_API_KEY) {
      try {
        const systemPrompt = `You are an expert educational assistant. Provide a deep dive explanation for the following knowledge bite. Keep it concise (2-3 paragraphs), engaging, and focus on practical insights and real-world applications.`;

        const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${GROQ_API_KEY}`,
          },
          body: JSON.stringify({
            messages: [
              {
                role: "system",
                content: systemPrompt,
              },
              {
                role: "user",
                content: `Topic: ${content}\nCategory: ${category}\nType: ${type}\n\nPlease provide a comprehensive but concise deep dive explanation with:\n1. Core concept explanation\n2. Real-world applications or examples\n3. Key takeaways for learning`,
              },
            ],
            model: "mixtral-8x7b-32768",
            temperature: 0.7,
            max_tokens: 500,
          }),
        });

        if (groqResponse.ok) {
          const data = await groqResponse.json();
          const insight = data.choices?.[0]?.message?.content;
          if (insight) {
            return new Response(JSON.stringify({ insight }), {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
          }
        } else {
          console.warn("Groq API error, falling back to JSON data:", groqResponse.status);
        }
      } catch (groqError) {
        console.warn("Groq API request failed, falling back to JSON data:", groqError);
      }
    }

    // Fallback to JSON data from knowledge_bites.json
    const bites = await loadKnowledgeBites();
    const fallbackInsight = getFallbackInsight(content, category, type, bites);
    return new Response(JSON.stringify({ insight: fallbackInsight }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("ai-insight error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
