
import { GoogleGenAI, Type } from "@google/genai";
import { Modifier, ParseResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    jiraId: {
      type: Type.STRING,
      description: "Extract the JIRA ID (e.g., RDSTDTL-2744)"
    },
    type: {
      type: Type.STRING,
      description: "Mapping: Bug/Defect -> bugfix, Story/Feature/Task -> feature, etc."
    },
    kebabDescription: {
      type: Type.STRING,
      description: "Kebab-case for branch naming"
    },
    shortSummary: {
      type: Type.STRING,
      description: "lowercase meaningful message for commit"
    },
    properTitle: {
      type: Type.STRING,
      description: "Title Case for MR title"
    },
    briefSummary: {
      type: Type.STRING,
      description: "A professional 2-3 sentence summary of the issue/work."
    },
    howToTest: {
      type: Type.STRING,
      description: "A clear, numbered list of steps to verify the fix or feature."
    }
  },
  required: ["jiraId", "type", "kebabDescription", "shortSummary", "properTitle", "briefSummary", "howToTest"]
};

export const parseIssueDetails = async (context: string, details: string): Promise<ParseResponse> => {
  const model = 'gemini-3-flash-preview';
  
  const systemInstruction = `
    You are a Senior Technical Lead. You receive JIRA ticket context and technical descriptions/bug reports.
    
    TASK 1: GENERATE GIT STRINGS
    - Branch: type/JIRA-ID/kebab-description
    - Commit: type(JIRA-ID): short-summary
    - MR Title: JIRA-ID: Proper Title
    
    TASK 2: ISSUE ANALYSIS
    - briefSummary: Explain 'What is the problem?' or 'What is being added?' concisely.
    - howToTest: Extract reproduction steps from the input and turn them into clear verification steps. If steps aren't explicit, infer them logically.

    MAPPING RULES FOR 'type':
    - Defect, Bug -> bugfix
    - Story, Feature, Task -> feature
    - Refactor -> refactor
    - Chore, Maintenance -> chore
    - Test -> test
    - CI/CD, Pipeline -> cicd
  `;

  const prompt = `
    JIRA CONTEXT:
    ${context}

    ISSUE/BUG DETAILS:
    ${details}
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: RESPONSE_SCHEMA,
    }
  });

  try {
    return JSON.parse(response.text.trim()) as ParseResponse;
  } catch (error) {
    console.error("Gemini parse error:", error);
    throw new Error("Failed to analyze issue. Please ensure both inputs contain valid JIRA/Technical information.");
  }
};
