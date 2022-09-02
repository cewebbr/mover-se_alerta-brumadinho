const {RateLimiterMemory} = require ("rate-limiter-flexible");

const limiterAll = new RateLimiterMemory({
  keyPrefix: 'rateLimiterAll',
  points: 5,  // How many requests per ip 
  duration: 5 // Seconds
});

const limiterCreate = new RateLimiterMemory({
  keyPrefix: 'rateLimiterCreate',
  points: 1,    // How many requests per ip 
  duration: 300 // Seconds
});

const rateLimiterAll = async function (req, res, next){
  try{
    await limiterAll.consume(req.ip);
    return next();
  }catch(err){
    return res.status(429).json({message: 'Too many requests', code:429})
  }
}

const rateLimiterCreate = async function (req, res, next){
  try{
    await limiterCreate.consume(req.ip);
    return next();
  }catch(err){
    return res.status(429).json({message: 'Too many requests', code:429})
  }
}

module.exports = { rateLimiterAll, rateLimiterCreate }