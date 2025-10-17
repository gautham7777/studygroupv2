
import { GoogleGenAI, Type } from "@google/genai";
import { StudyPlan } from '../types';

const getAi = () => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set");
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateStudyPlan = async (subject: string, topics: string): Promise<StudyPlan | null> => {
  try {
    const ai = getAi();
    const prompt = `Generate a 5-day study plan for the subject "${subject}". The plan should cover these topics if provided: "${topics}". If no topics are provided, create a general introductory plan for the subject. The plan must include daily goals, key concepts to cover, and suggested activities for active learning.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            plan: {
              type: Type.ARRAY,
              description: "An array of daily study plans for 5 days.",
              items: {
                type: Type.OBJECT,
                properties: {
                  day: { type: Type.INTEGER, description: "The day number (1-5)." },
                  goal: { type: Type.STRING, description: "The main goal for the day." },
                  concepts: {
                    type: Type.ARRAY,
                    description: "A list of key concepts to study.",
                    items: { type: Type.STRING },
                  },
                  activities: {
                    type: Type.ARRAY,
                    description: "A list of suggested activities for learning.",
                    items: { type: Type.STRING },
                  },
                },
                required: ["day", "goal", "concepts", "activities"],
              },
            },
          },
          required: ["plan"],
        },
      },
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText);

  } catch (error) {
    console.error("Error generating study plan:", error);
    return null;
  }
};
