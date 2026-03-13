import type { ContentItem, Category } from "@/types/game";

// ─── TOOL MATCH CURRICULUM ───
// AI tool selection training: match tasks to the right tool

export interface Tool {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface ToolMatchItem extends ContentItem {
  toolOptions: string[];
}

export const tools: Tool[] = [
  { id: "chatgpt", name: "ChatGPT", icon: "⌘", color: "#10a37f" },
  { id: "midjourney", name: "Midjourney", icon: "◆", color: "#b565f7" },
  { id: "copilot", name: "Copilot", icon: "▶", color: "#6cc644" },
  { id: "whisper", name: "Whisper", icon: "◎", color: "#ff6b35" },
  { id: "google-search", name: "Search", icon: "◉", color: "#4285f4" },
  { id: "spreadsheet", name: "Sheets", icon: "▦", color: "#0f9d58" },
  { id: "human-expert", name: "Human", icon: "◈", color: "#e67e22" },
  { id: "dont-use-ai", name: "No AI", icon: "✕", color: "#ff4444" },
];

export const categories: Category[] = [
  {
    id: "text-tasks",
    title: "Text Tasks",
    description: "Writing, editing, summarizing, translating",
    icon: "✎",
    levels: [
      { id: 1, name: "Basics", items: ["tt-001","tt-002","tt-003","tt-004","tt-005","tt-006","tt-007","tt-008"], requiredXp: 0, gameMode: "match" },
    ],
  },
  {
    id: "visual-tasks",
    title: "Visual Tasks",
    description: "Design, images, presentations, mockups",
    icon: "◐",
    levels: [
      { id: 1, name: "Basics", items: ["vt-001","vt-002","vt-003","vt-004","vt-005","vt-006","vt-007"], requiredXp: 50, gameMode: "match" },
    ],
  },
];

export const items: ToolMatchItem[] = [
  // ─── TEXT TASKS ───
  { id: "tt-001", prompt: "Summarize a 50-page legal contract into key points", answer: "chatgpt", category: "text-tasks", difficulty: "easy", toolOptions: ["chatgpt","copilot","google-search","dont-use-ai"], enrichment: { whyItMatters: "LLMs excel at distilling long documents. This saves hours of manual reading.", realWorldExample: "Law firms use Claude/ChatGPT to draft first-pass summaries before human review.", proTip: "Always have a lawyer verify AI-generated legal summaries — they can miss nuance." } },
  { id: "tt-002", prompt: "Transcribe a 2-hour recorded interview into text", answer: "whisper", category: "text-tasks", difficulty: "easy", toolOptions: ["chatgpt","whisper","copilot","dont-use-ai"], enrichment: { whyItMatters: "Speech-to-text models like Whisper are purpose-built for transcription.", realWorldExample: "Journalists use Whisper to transcribe interviews in minutes. 95%+ accuracy for clear English.", proTip: "For accents or technical jargon, do a quick review pass after AI transcription." } },
  { id: "tt-003", prompt: "Write a sympathy card for a coworker who lost a family member", answer: "dont-use-ai", category: "text-tasks", difficulty: "easy", toolOptions: ["chatgpt","midjourney","google-search","dont-use-ai"], enrichment: { whyItMatters: "Genuine emotion can't be outsourced. AI condolences risk being discovered and causing more hurt.", realWorldExample: "A manager was caught using ChatGPT for a sympathy email. The grieving employee felt doubly betrayed.", proTip: "Ask: 'Would this person feel hurt if they knew AI wrote this?' If yes, write it yourself." } },
  { id: "tt-004", prompt: "Translate a restaurant menu from French to English", answer: "chatgpt", category: "text-tasks", difficulty: "easy", toolOptions: ["chatgpt","google-search","human-expert","dont-use-ai"], enrichment: { whyItMatters: "LLMs handle common language translation well, especially for informal content.", realWorldExample: "Travelers use ChatGPT to quickly translate menus, signs, and basic conversations.", proTip: "For official documents, always use a certified human translator." } },
  { id: "tt-005", prompt: "Draft a professional resignation letter", answer: "chatgpt", category: "text-tasks", difficulty: "easy", toolOptions: ["chatgpt","copilot","spreadsheet","dont-use-ai"], enrichment: { whyItMatters: "AI can generate professional templates. A resignation letter is formulaic enough for AI.", realWorldExample: "Many professionals use AI to draft the initial structure, then personalize it.", proTip: "Add personal touches — mention specific colleagues or experiences that mattered to you." } },
  { id: "tt-006", prompt: "Proofread your wedding vows for grammar mistakes", answer: "dont-use-ai", category: "text-tasks", difficulty: "medium", toolOptions: ["chatgpt","google-search","human-expert","dont-use-ai"], enrichment: { whyItMatters: "AI might 'fix' your authentic voice into generic language. Vows should sound like YOU.", realWorldExample: "A bride used ChatGPT to polish vows and it removed all the quirky personal touches her partner loved.", proTip: "If you need grammar help for deeply personal writing, ask a trusted friend instead." } },
  { id: "tt-007", prompt: "Generate 20 blog post title ideas about sustainable fashion", answer: "chatgpt", category: "text-tasks", difficulty: "easy", toolOptions: ["chatgpt","midjourney","google-search","dont-use-ai"], enrichment: { whyItMatters: "Brainstorming is one of AI's strongest use cases — volume of ideas with zero writer's block.", realWorldExample: "Content marketers use AI to generate title variations, then pick the best 3-4 to develop.", proTip: "Give AI context about your audience and tone for much better suggestions." } },
  { id: "tt-008", prompt: "Find out what time the Super Bowl starts this Sunday", answer: "google-search", category: "text-tasks", difficulty: "easy", toolOptions: ["chatgpt","google-search","spreadsheet","dont-use-ai"], enrichment: { whyItMatters: "LLMs have knowledge cutoffs. Real-time event data needs a search engine.", realWorldExample: "ChatGPT confidently gave wrong kickoff times because its training data was outdated.", proTip: "For anything time-sensitive — scores, stocks, weather, events — always use search." } },
  // ─── VISUAL TASKS ───
  { id: "vt-001", prompt: "Create a mood board of color palettes for a beach resort brand", answer: "midjourney", category: "visual-tasks", difficulty: "easy", toolOptions: ["chatgpt","midjourney","copilot","dont-use-ai"], enrichment: { whyItMatters: "Image generators excel at visual concept exploration and mood boards.", realWorldExample: "Design agencies use Midjourney to generate rapid visual concepts before client presentations.", proTip: "Use descriptive style prompts like 'minimalist', 'tropical', 'luxury' for better results." } },
  { id: "vt-002", prompt: "Design a company logo that will be trademarked", answer: "dont-use-ai", category: "visual-tasks", difficulty: "easy", toolOptions: ["midjourney","chatgpt","human-expert","dont-use-ai"], enrichment: { whyItMatters: "AI-generated images have unclear copyright status. Trademarking AI art is legally murky.", realWorldExample: "The US Copyright Office ruled AI-generated images can't be copyrighted, affecting trademark applications.", proTip: "Use AI for inspiration/mood boards, but hire a designer for final trademark-able assets." } },
  { id: "vt-003", prompt: "Generate concept art for a sci-fi video game environment", answer: "midjourney", category: "visual-tasks", difficulty: "easy", toolOptions: ["midjourney","chatgpt","copilot","dont-use-ai"], enrichment: { whyItMatters: "AI image generation is perfect for rapid concept exploration in early creative phases.", realWorldExample: "Game studios use DALL-E and Midjourney for pre-production concept art exploration.", proTip: "Iterate with reference images and style keywords. Combine multiple outputs for unique results." } },
  { id: "vt-004", prompt: "Create a chart showing quarterly revenue by region", answer: "spreadsheet", category: "visual-tasks", difficulty: "easy", toolOptions: ["chatgpt","midjourney","spreadsheet","dont-use-ai"], enrichment: { whyItMatters: "Spreadsheets are purpose-built for data visualization. AI image generators can't process real data.", realWorldExample: "Excel and Google Sheets produce accurate, editable charts that update when data changes.", proTip: "For complex data stories, use tools like Tableau or D3.js alongside spreadsheets." } },
  { id: "vt-005", prompt: "Sketch a portrait of your best friend as a birthday gift", answer: "dont-use-ai", category: "visual-tasks", difficulty: "medium", toolOptions: ["midjourney","chatgpt","human-expert","dont-use-ai"], enrichment: { whyItMatters: "A personal gift carries meaning because YOU made it. AI removes the personal touch.", realWorldExample: "Hand-drawn gifts, even imperfect ones, are kept and treasured. AI prints get forgotten.", proTip: "The effort IS the gift. Your friend will value your attempt more than AI perfection." } },
  { id: "vt-006", prompt: "Generate 10 social media banner variations for A/B testing", answer: "midjourney", category: "visual-tasks", difficulty: "easy", toolOptions: ["midjourney","chatgpt","spreadsheet","dont-use-ai"], enrichment: { whyItMatters: "AI can rapidly produce visual variations, perfect for A/B testing at scale.", realWorldExample: "Marketing teams generate dozens of ad variations with AI, then test which performs best.", proTip: "Keep brand guidelines consistent — use style references and seed values for coherent variations." } },
  { id: "vt-007", prompt: "Photo-edit a deceased relative into a family photo they missed", answer: "dont-use-ai", category: "visual-tasks", difficulty: "medium", toolOptions: ["midjourney","chatgpt","human-expert","dont-use-ai"], enrichment: { whyItMatters: "This raises deep ethical questions about consent, grief processing, and digital manipulation.", realWorldExample: "Families who used AI for memorial photos reported mixed emotions — comfort but also unease.", proTip: "Grief counselors suggest preserving authentic memories rather than creating synthetic ones." } },
];

export function getItemsByCategory(categoryId: string): ToolMatchItem[] {
  return items.filter((item) => item.category === categoryId);
}

export function getItemsByLevel(categoryId: string, levelId: number): ToolMatchItem[] {
  const category = categories.find((c) => c.id === categoryId);
  if (!category) return [];
  const level = category.levels.find((l) => l.id === levelId);
  if (!level) return [];
  return level.items
    .map((id) => items.find((item) => item.id === id))
    .filter((item): item is ToolMatchItem => item !== undefined);
}

export function getToolById(id: string): Tool | undefined {
  return tools.find((t) => t.id === id);
}
