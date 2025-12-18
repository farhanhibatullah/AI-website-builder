
import { GoogleGenAI, Type } from "@google/genai";
import { WebsiteBlueprint, GlobalStyle } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const SYSTEM_PROMPT = `You are a world-class AI Website Architect & Senior Frontend Engineer.
Your task is to analyze user needs and build multi-page websites that are consistent, modern, and ready to deploy.
Principles:
- Focus on MVP structure.
- Use modular components.
- Maintain consistent global styles across all pages.
- Output high-quality React + Tailwind code.`;

export const generateBlueprint = async (params: {
  goal: string;
  audience: string;
  type: string;
  pagesRequested: string[];
  colors: string[];
  tone: string;
}): Promise<WebsiteBlueprint> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Based on the following user input:
- Website Goal: ${params.goal}
- Target Audience: ${params.audience}
- Website Type: ${params.type}
- Pages Requested: ${params.pagesRequested.join(', ')}
- Colors: ${params.colors.join(', ')}
- Tone: ${params.tone}

Create a WEBSITE BLUEPRINT in JSON format. Do not output HTML.
Ensure all pages are connected via the navigation.`,
    config: {
      systemInstruction: SYSTEM_PROMPT,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          website_goal: { type: Type.STRING },
          audience: { type: Type.STRING },
          pages: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                slug: { type: Type.STRING },
                title: { type: Type.STRING },
                goal: { type: Type.STRING },
                sections: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      type: { type: Type.STRING },
                      purpose: { type: Type.STRING }
                    },
                    required: ["id", "type", "purpose"]
                  }
                }
              },
              required: ["slug", "title", "goal", "sections"]
            }
          },
          navigation: { type: Type.ARRAY, items: { type: Type.STRING } },
          global_style: {
            type: Type.OBJECT,
            properties: {
              primary_color: { type: Type.STRING },
              secondary_color: { type: Type.STRING },
              accent_color: { type: Type.STRING },
              font_family: { type: Type.STRING },
              tone: { type: Type.STRING }
            }
          }
        },
        required: ["website_goal", "audience", "pages", "navigation", "global_style"]
      },
    },
  });

  return JSON.parse(response.text);
};

export const generatePageCode = async (
  blueprint: WebsiteBlueprint,
  pageSlug: string
): Promise<string> => {
  const page = blueprint.pages.find(p => p.slug === pageSlug);
  if (!page) throw new Error("Page not found");

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Use the following WEBSITE BLUEPRINT:
${JSON.stringify(blueprint, null, 2)}

Build the full React code for the page:
- slug: ${pageSlug}

Requirements:
- Use React + Tailwind CSS.
- Include a consistent Navbar (using slugs from blueprint: ${blueprint.navigation.join(', ')}) and Footer.
- Each section from the blueprint must be implemented.
- Use Lucide icons (available globally as "lucide-react").
- Use the global styles: ${JSON.stringify(blueprint.global_style)}.
- The code must be self-contained in one block.
- DO NOT use external assets except placeholder images (https://picsum.photos/800/600).
- Output ONLY the component code starting from imports to export default.`,
    config: {
      systemInstruction: SYSTEM_PROMPT,
      temperature: 0.7,
    },
  });

  return response.text.replace(/```tsx|```javascript|```/g, '').trim();
};

export const regenerateSection = async (
  blueprint: WebsiteBlueprint,
  pageSlug: string,
  sectionId: string
): Promise<string> => {
  const page = blueprint.pages.find(p => p.slug === pageSlug);
  const section = page?.sections.find(s => s.id === sectionId);

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Regenerate the code for this specific section:
- Page: ${pageSlug}
- Section Type: ${section?.type}
- Purpose: ${section?.purpose}
- Brand Tone: ${blueprint.global_style.tone}
- Audience: ${blueprint.audience}

Constraints:
- Must fit the current global styles: ${JSON.stringify(blueprint.global_style)}.
- Only provide the JSX/React code for that specific section as a functional component.`,
    config: { systemInstruction: SYSTEM_PROMPT }
  });

  return response.text;
};
