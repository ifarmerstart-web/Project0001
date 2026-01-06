import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { SEED_TECH_SYSTEM_INSTRUCTION } from "../constants";

let aiClient: GoogleGenAI | null = null;
let chatSession: Chat | null = null;

export const initializeGemini = () => {
  if (!process.env.API_KEY) {
    console.error("API_KEY is missing");
    throw new Error("API Key is missing");
  }
  
  // Always create a new client to ensure we use the latest key if it somehow changed (though env usually constant)
  aiClient = new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const startChatSession = async (): Promise<string> => {
  if (!aiClient) initializeGemini();
  if (!aiClient) throw new Error("Failed to initialize AI client");

  chatSession = aiClient.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: SEED_TECH_SYSTEM_INSTRUCTION,
      temperature: 0.7, // slightly creative for variety in numbers, but structured
    },
  });

  // Trigger the first message from the AI to start the quiz
  try {
    const response: GenerateContentResponse = await chatSession.sendMessage({
      message: "안녕하세요! 훈련을 시작해주세요.",
    });
    return response.text || "";
  } catch (error) {
    console.error("Error starting chat:", error);
    throw error;
  }
};

export const sendMessageToGemini = async (userMessage: string): Promise<string> => {
  if (!chatSession) {
    throw new Error("Chat session not initialized");
  }

  try {
    const response: GenerateContentResponse = await chatSession.sendMessage({
      message: userMessage,
    });
    return response.text || "";
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};
