const OpenAI = require('openai');

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || 'your-openai-api-key-here'
});

async function getChatResponse(message, userContext, type = 'general') {
  try {
    let systemPrompt = '';
    
    if (type === 'daily-planning') {
      systemPrompt = `You are Goal AI, a specialized assistant for JEE/NEET preparation. Help the student plan their day effectively based on their goals and current preparation status. Be motivational and specific.`;
    } else if (type === 'evening-checkin') {
      systemPrompt = `You are Goal AI, helping a JEE/NEET student reflect on their day's progress. Ask specific questions about what they accomplished and provide constructive feedback and motivation for tomorrow.`;
    } else {
      systemPrompt = `You are Goal AI, a specialized AI assistant for JEE/NEET preparation. You help students track their goals, plan their studies, and stay motivated. Be encouraging, specific, and focus on actionable advice.`;
    }

    const contextInfo = userContext ? `
    Student Context:
    - Exam: ${userContext.examType || 'Not specified'}
    - Target Year: ${userContext.targetYear || 'Not specified'}
    - Preparation Duration: ${userContext.preparationYears || 'Not specified'} years
    - Current Class: ${userContext.currentClass || 'Not specified'}
    - Study Hours: ${userContext.studyHours || 'Not specified'} hours/day
    ` : '';

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: systemPrompt + contextInfo
        },
        {
          role: "user",
          content: message
        }
      ],
      max_tokens: 500,
      temperature: 0.7
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API error:', error);
    return "I'm sorry, I'm having trouble connecting right now. Please try again later.";
  }
}

async function generateDailyPlan(userContext) {
  try {
    const prompt = `Based on the student's profile, generate a detailed daily study plan. Focus on JEE/NEET preparation with specific subjects and time allocations. Return only the plan content, be specific and actionable.

    Student Profile:
    - Exam: ${userContext.examType}
    - Target Year: ${userContext.targetYear}
    - Preparation Duration: ${userContext.preparationYears} years
    - Current Class: ${userContext.currentClass}
    - Daily Study Hours: ${userContext.studyHours} hours
    - Weak Subjects: ${userContext.weakSubjects || 'Not specified'}
    - Strong Subjects: ${userContext.strongSubjects || 'Not specified'}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are Goal AI, an expert in JEE/NEET preparation planning. Create detailed, time-specific daily study plans."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 600,
      temperature: 0.6
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Daily plan generation error:', error);
    return "Unable to generate daily plan at the moment. Please try again later.";
  }
}

async function analyzeProgress(userContext, plannedWork, actualWork) {
  try {
    const prompt = `Analyze the student's progress for today and provide a score out of 100, along with specific feedback and suggestions for improvement.

    Student Profile:
    - Exam: ${userContext.examType}
    - Target Year: ${userContext.targetYear}

    Planned Work: ${plannedWork}
    Actual Work Done: ${actualWork}

    Provide analysis in JSON format with:
    {
      "score": number (0-100),
      "feedback": "detailed feedback string",
      "suggestions": "improvement suggestions string",
      "motivation": "motivational message string"
    }`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are Goal AI, analyzing student progress. Be honest but encouraging. Provide actionable feedback."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 400,
      temperature: 0.5
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error('Progress analysis error:', error);
    return {
      score: 0,
      feedback: "Unable to analyze progress at the moment.",
      suggestions: "Please try again later.",
      motivation: "Keep working hard towards your goal!"
    };
  }
}

module.exports = {
  getChatResponse,
  generateDailyPlan,
  analyzeProgress
};
