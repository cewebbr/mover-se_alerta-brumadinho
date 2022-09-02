const Joi = require('joi');

const validateLogin = Joi.object({
  
  password: 
    Joi.string().min(3).max(20).pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
    .when('$function', { 
      is: Joi.valid('auth', 'redefinePassword'), 
      then: Joi.required() 
    }),

  email: 
    Joi.string()
    .email()
    .when('$function', { 
      is: Joi.valid('forgotPassword', 'auth'), 
      then: Joi.required() 
    }),

  token: 
    Joi.alternatives()
    .try(
      Joi.string().regex(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/=]*$/),
      Joi.string().hex()
    )
    .when('$function', { 
      is: Joi.valid('confirmToken', 'redefinePassword', 'getUser'), 
      then: Joi.required() 
    })
});

module.exports = { validateLogin }