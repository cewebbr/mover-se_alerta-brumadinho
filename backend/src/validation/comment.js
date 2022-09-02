const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const validateComment = Joi.object({

  token: 
    Joi.string()
    .regex(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/=]*$/)
    .when('$function', { 
      is: Joi.valid('add', 'like', 'removeLike'), 
      then: Joi.required() 
    }),

  id: 
    Joi.objectId()
    .when('$function', { 
      is: Joi.valid('get', 'getLikes', 'update', 'like', 'removeLike', 'removeComment'), 
      then: Joi.required() 
    }),

  description:
    Joi.string().min(2).max(200)
    .when('$function', { 
      is: Joi.valid('add', 'update'), 
      then: Joi.required() 
    })

});

module.exports = { validateComment }