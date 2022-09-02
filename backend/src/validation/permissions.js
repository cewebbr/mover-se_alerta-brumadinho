const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const validatePermissions = Joi.object({

  token: 
    Joi.string()
    .regex(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/=]*$/)
    .required(),
    
  email: 
    Joi.string().email()
    .when('$function', { 
      is: Joi.valid('isHimself', 'isHimselfOrAdmin'), 
      then: Joi.required()
    }),  

  id: 
    Joi.objectId()
    .when('$function', { 
      is: Joi.valid('isMyComment', 'isMyDenunciation', 'canRemoveComment'), 
      then: Joi.required() 
    }),

  comment: 
    Joi.objectId()
    .when('$function', { 
      is: Joi.valid('canRemoveComment'), 
      then: Joi.required() 
    })

});

module.exports = { validatePermissions }