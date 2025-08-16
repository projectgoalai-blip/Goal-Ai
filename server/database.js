// In-memory database for development
let users = new Map();
let userOnboarding = new Map();
let userChats = new Map();
let userProfiles = new Map();
let userIdCounter = 1;

function createUser(userData) {
  const user = {
    id: userIdCounter++,
    ...userData
  };
  users.set(user.id, user);
  return user;
}

function getUserById(id) {
  return users.get(id);
}

function getUserByEmail(email) {
  for (const user of users.values()) {
    if (user.email === email) {
      return user;
    }
  }
  return null;
}

function updateUserOnboarding(userId, data) {
  userOnboarding.set(userId, {
    ...userOnboarding.get(userId),
    ...data,
    completed: true,
    completedAt: new Date().toISOString()
  });
}

function getUserOnboarding(userId) {
  return userOnboarding.get(userId);
}

function addChatMessage(userId, chatData) {
  if (!userChats.has(userId)) {
    userChats.set(userId, []);
  }
  userChats.get(userId).push(chatData);
}

function getUserChats(userId) {
  return userChats.get(userId) || [];
}

function updateUserProfile(userId, profileData) {
  userProfiles.set(userId, {
    ...userProfiles.get(userId),
    ...profileData,
    updatedAt: new Date().toISOString()
  });
}

function getUserProfile(userId) {
  return userProfiles.get(userId);
}

module.exports = {
  createUser,
  getUserById,
  getUserByEmail,
  updateUserOnboarding,
  getUserOnboarding,
  addChatMessage,
  getUserChats,
  updateUserProfile,
  getUserProfile
};
