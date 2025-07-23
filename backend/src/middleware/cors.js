/**
 * Custom CORS middleware to ensure proper cross-origin resource sharing
 */
const corsMiddleware = (req, res, next) => {
  // Allow all origins for development
  res.header('Access-Control-Allow-Origin', '*');
  
  // Allow credentials
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Allow specific headers
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  
  // Allow specific methods
  res.header(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS, PATCH'
  );
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Move to the next middleware
  next();
};

module.exports = corsMiddleware; 