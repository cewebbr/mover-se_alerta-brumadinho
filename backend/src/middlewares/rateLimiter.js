const {RateLimiterMemory} = require ("rate-limiter-flexible");

const limiterAll = new RateLimiterMemory({
  keyPrefix: 'rateLimiterAll',
  points: process.env.RATE_LIMITER_ALL_POINTS,    // How many requests per ip 
  duration: process.env.RATE_LIMITER_ALL_DURATION // Seconds
});

const limiterCreate = new RateLimiterMemory({
  keyPrefix: 'rateLimiterCreate',
  points: process.env.RATE_LIMITER_CREATE_POINTS,    // How many requests per ip 
  duration: process.env.RATE_LIMITER_CREATE_DURATION // Seconds
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