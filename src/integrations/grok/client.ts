// Deep Dive Insights - Loads explanations from knowledge_bites.json

// Cache for knowledge bites
let cachedBites: any[] | null = null;

async function loadKnowledgeBites(): Promise<any[]> {
  if (cachedBites) return cachedBites;
  
  try {
    const response = await fetch("/data/knowledge_bites.json");
    if (response.ok) {
      cachedBites = await response.json();
      return cachedBites;
    }
  } catch (_err) {
    console.warn("Failed to load knowledge_bites.json");
  }
  
  return [];
}

// Generate contextual explanation based on bite type and category
function generateContextualExplanation(bite: any): string {
  const { type, category, content, answer, options } = bite;
  
  let explanation = "";
  
  if (type === "quiz") {
    explanation = `This is a quiz question about ${category.toLowerCase()} knowledge.\n\n`;
    if (answer) {
      explanation += `The correct answer is: ${answer}\n\n`;
    }
    explanation += `Understanding the correct answer helps build your knowledge in this area. `;
    explanation += `Consider how this concept applies to real-world scenarios and other related topics.`;
  } else if (type === "fact") {
    explanation = `This is an interesting fact: ${content}\n\n`;
    explanation += `Facts like these help expand your general knowledge and understanding of the world. `;
    explanation += `Try to explore how this fact connects to other areas of knowledge you're familiar with.`;
  } else if (type === "tip") {
    explanation = `This is a practical tip: ${content}\n\n`;
    explanation += `Implementing this tip can improve your effectiveness in ${category.toLowerCase()} areas. `;
    explanation += `The key is to consistently apply it in your work and notice the positive changes.`;
  }
  
  return explanation;
}

export async function generateDeepDiveInsight(
  content: string
): Promise<string> {
  try {
    const bites = await loadKnowledgeBites();
    // Find the bite that matches this content exactly (trimmed)
    const matchingBite = bites.find(bite => 
      bite.content.trim() === content.trim()
    );
    
    if (!matchingBite) {
      console.warn("No matching bite found for content:", content);
      return "Detailed explanation not available. Please refer to the bite details above.";
    }
    
    // If the bite has an explanation field with content, return it
    if (matchingBite.explanation && matchingBite.explanation.trim()) {
      return matchingBite.explanation;
    }
    
    // Otherwise generate a contextual explanation based on the bite type and category
    return generateContextualExplanation(matchingBite);
  } catch (error: any) {
    console.error("Error loading deep dive insight:", error);
    return "Unable to load detailed explanation. Please try again.";
  }
}
