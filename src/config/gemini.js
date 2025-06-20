// geminiSummary.js

import { GoogleGenerativeAI } from "@google/generative-ai";

// Replace with your own Gemini API key
const genAI = new GoogleGenerativeAI('AIzaSyC4-BW1YAZoInVst3512zx4Wcx2VVfnc6M');

// Function to call Gemini AI
const getGeminiResponse = async (prompt) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error("❌ Gemini API Error:", error);
    return "Error generating summary. Please try again.";
  }
};

// Function to generate resume content
export const generateResumeContent = async (section, userInput) => {
  const prompt = `
Create a highly professional and concise resume summary for the following candidate:

Name: ${userInput.name}
Role: ${userInput.role}
Years of Experience: ${userInput.experience}
Expertise: ${userInput.expertise}
Key Skills: ${userInput.skills}

Requirements:
- Begin with a strong professional title (e.g., "Experienced Frontend Developer...")
- Highlight technical expertise and achievements
- Include soft skills or leadership strengths where relevant
- Maintain a formal tone suitable for job applications
- Limit to 3–4 impactful sentences

Provide only the summary text. Do not include bullet points or formatting.
`;

  return await getGeminiResponse(prompt);
};

export const generateCoverLetter = async (userInput) => {
  const prompt = `Generate a professional cover letter with the following details:
    Job Title: ${userInput.jobTitle}
    Company Name: ${userInput.companyName}
    Industry: ${userInput.industry}
    Key Skills: ${userInput.keySkills}
    Experience Level: ${userInput.experienceLevel}
    Specific Achievements: ${userInput.achievements}
    Company Research: ${userInput.companyInfo}

    Please create a compelling cover letter that:
    1. Opens with a strong introduction showing enthusiasm for the role
    2. Demonstrates knowledge of the company
    3. Highlights relevant skills and experiences
    4. Includes specific achievements that align with the role
    5. Closes with a clear call to action
    6. Maintains a professional yet engaging tone
    7. Is structured in clear paragraphs
    
    Format the letter in a professional business letter style.`;

  return await getGeminiResponse(prompt);
};
