module.exports = {
  ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 3000,
  URL: process.env.BASE_URL || 'http://localhost:3000',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb+srv://gitconnected:canada27@gitconnected-ysa2u.mongodb.net/admin?retryWrites=true&w=majority'
};