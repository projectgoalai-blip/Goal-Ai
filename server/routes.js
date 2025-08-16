const { getUserById, updateUserOnboarding, getUserOnboarding, addChatMessage, getUserChats, updateUserProfile } = require('./database');
const { getChatResponse, generateDailyPlan, analyzeProgress } = require('./openai');

function registerRoutes(app) {
  // Test endpoint
  app.get('/api/test', (req, res) => {
    res.json({ status: 'ok', message: 'Goal AI backend is running' });
  });
  // Middleware to check authentication
  const requireAuth = (req, res, next) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    next();
  };

  // Save onboarding data
  app.post('/api/onboarding', requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId;
      const onboardingData = req.body;

      updateUserOnboarding(userId, onboardingData);
      
      res.json({ success: true });
    } catch (error) {
      console.error('Onboarding error:', error);
      res.status(500).json({ error: 'Failed to save onboarding data' });
    }
  });

  // Get onboarding data
  app.get('/api/onboarding', requireAuth, (req, res) => {
    try {
      const userId = req.session.userId;
      const onboarding = getUserOnboarding(userId);
      
      res.json(onboarding || {});
    } catch (error) {
      console.error('Get onboarding error:', error);
      res.status(500).json({ error: 'Failed to get onboarding data' });
    }
  });

  // Chat with AI
  app.post('/api/chat', requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId;
      const { message, type = 'general' } = req.body;

      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }

      // Get user onboarding data for context
      const onboarding = getUserOnboarding(userId);
      
      // Get AI response
      const aiResponse = await getChatResponse(message, onboarding, type);
      
      // Save chat messages
      addChatMessage(userId, {
        userMessage: message,
        aiResponse: aiResponse,
        type: type,
        timestamp: new Date().toISOString()
      });

      res.json({ response: aiResponse });
    } catch (error) {
      console.error('Chat error:', error);
      res.status(500).json({ error: 'Failed to get AI response' });
    }
  });

  // Get chat history
  app.get('/api/chats', requireAuth, (req, res) => {
    try {
      const userId = req.session.userId;
      const chats = getUserChats(userId);
      
      res.json(chats || []);
    } catch (error) {
      console.error('Get chats error:', error);
      res.status(500).json({ error: 'Failed to get chat history' });
    }
  });

  // Generate daily plan
  app.post('/api/daily-plan', requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId;
      const onboarding = getUserOnboarding(userId);
      
      if (!onboarding) {
        return res.status(400).json({ error: 'Onboarding not completed' });
      }

      const dailyPlan = await generateDailyPlan(onboarding);
      
      res.json({ plan: dailyPlan });
    } catch (error) {
      console.error('Daily plan error:', error);
      res.status(500).json({ error: 'Failed to generate daily plan' });
    }
  });

  // Analyze progress
  app.post('/api/analyze-progress', requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId;
      const { todayPlan, actualWork } = req.body;
      
      const onboarding = getUserOnboarding(userId);
      const analysis = await analyzeProgress(onboarding, todayPlan, actualWork);
      
      res.json({ analysis });
    } catch (error) {
      console.error('Progress analysis error:', error);
      res.status(500).json({ error: 'Failed to analyze progress' });
    }
  });

  // Update profile
  app.put('/api/profile', requireAuth, (req, res) => {
    try {
      const userId = req.session.userId;
      const profileData = req.body;
      
      updateUserProfile(userId, profileData);
      
      res.json({ success: true });
    } catch (error) {
      console.error('Profile update error:', error);
      res.status(500).json({ error: 'Failed to update profile' });
    }
  });
}

module.exports = { registerRoutes };
