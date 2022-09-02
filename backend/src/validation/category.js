const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const validateCategory = Joi.object({

  id: 
    Joi.objectId()
    .when('$function', { 
      is: Joi.valid('get', 'update', 'remove'), 
      then: Joi.required() 
    }),

  name:
    Joi.string().min(2).max(70)
    .when('$function', { 
      is: Joi.valid('add'), 
      then: Joi.required() 
    }),

  description:
    Joi.string().min(2).max(200)
    .when('$function', { 
      is: Joi.valid('add'), 
      then: Joi.required() 
    })

});

module.exports = { validateCategory }