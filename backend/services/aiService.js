const OpenAI = require('openai');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize OpenAI client
let openaiClient = null;
if (process.env.OPENAI_API_KEY) {
  openaiClient = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

// Initialize Gemini client
let geminiClient = null;
if (process.env.GEMINI_API_KEY) {
  geminiClient = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

// Platform-specific content guidelines
const platformGuidelines = {
  twitter: {
    maxLength: 280,
    style: 'concise, engaging, with hashtags',
    tips: 'Use emojis, keep it short, add 2-3 relevant hashtags'
  },
  linkedin: {
    maxLength: 3000,
    style: 'professional, insightful, value-driven',
    tips: 'Share insights, use professional tone, add call-to-action'
  },
  instagram: {
    maxLength: 2200,
    style: 'visual, storytelling, engaging',
    tips: 'Focus on visuals, tell a story, use relevant hashtags (5-10)'
  },
  general: {
    maxLength: 1000,
    style: 'engaging and platform-appropriate',
    tips: 'Keep it relevant and engaging'
  }
};

// Generate text content using OpenAI GPT
const generateTextContent = async (prompt, platform = 'general') => {
  if (!openaiClient) {
    throw new Error('OpenAI API key not configured');
  }

  const guidelines = platformGuidelines[platform] || platformGuidelines.general;

  const systemPrompt = `You are an expert social media content creator specializing in ${platform}. 

Guidelines:
- Maximum length: ${guidelines.maxLength} characters
- Style: ${guidelines.style}
- Tips: ${guidelines.tips}

Create engaging, authentic content that doesn't sound too AI-generated. Make it conversational and relatable.`;

  try {
    const completion = await openaiClient.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 500,
      temperature: 0.8,
    });

    return completion.choices[0].message.content.trim();
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error(`Failed to generate text content: ${error.message}`);
  }
};

// Generate image prompt using Google Gemini
const generateImagePrompt = async (prompt) => {
  if (!geminiClient) {
    throw new Error('Gemini API key not configured');
  }

  try {
    const model = geminiClient.getGenerativeModel({ model: 'gemini-pro' });
    
    const enhancedPrompt = `Create a detailed, creative image generation prompt for the following concept: "${prompt}"

The prompt should:
- Be highly descriptive and visual
- Include artistic style suggestions
- Specify colors, lighting, and mood
- Be optimized for AI image generation tools
- Be between 50-100 words

Provide only the image prompt, nothing else.`;

    const result = await model.generateContent(enhancedPrompt);
    const response = await result.response;
    const text = response.text();

    return text.trim();
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error(`Failed to generate image prompt: ${error.message}`);
  }
};

// Main function to generate AI content
const generateAIContent = async (prompt, type, platform = 'general') => {
  if (!prompt || !type) {
    throw new Error('Prompt and type are required');
  }

  if (type === 'text') {
    return await generateTextContent(prompt, platform);
  } else if (type === 'image') {
    return await generateImagePrompt(prompt);
  } else {
    throw new Error('Invalid type. Must be either "text" or "image"');
  }
};

module.exports = {
  generateAIContent,
  generateTextContent,
  generateImagePrompt
};