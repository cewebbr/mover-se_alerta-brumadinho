const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)

const validateAgency = Joi.object({

  cnpj: Joi.string().length(14)
    .when('$function', { 
      is: Joi.valid('add'), 
      then: Joi.required() 
    }),

  name: 
    Joi.string().min(2).max(70)
    .when('$function', { 
      is: Joi.valid('add'), 
      then: Joi.required() 
    }),

  phone: 
    Joi.string().min(11).max(15).pattern(/^[0-9]+$/)
    .when('$function', { 
      is: Joi.valid('add'), 
      then: Joi.required() 
    }),
  
  email: 
    Joi.string().email()
    .when('$function', { 
      is: Joi.valid('add', 'updatePublicAgency', 'updateAdmin', 'get', 'getPublic'), 
      then: Joi.required() 
    }),

  uf: 
    Joi.string().length(2).valid('MG')
    /*.when('$function', { 
      is: Joi.valid('add'), 
      then: Joi.required() 
    })*/,
  
  city:
    Joi.string().min(4).max(50).valid('Brumadinho')
    /*.when('$function', { 
      is: Joi.valid('add'), 
      then: Joi.required() 
    })*/,
 
  password: 
    Joi.string().min(6).max(20).pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
    .when('$function', { 
      is: Joi.valid('add'), 
      then: Joi.required() 
    }),

  photo: Joi.string().uri().allow(''),

  verification:
    Joi.string().valid('unverified', 'accepted', 'rejected')
    .when('$function', { 
      is: Joi.valid('updateAdmin', 'getFromVerification'), 
      then: Joi.required() 
    }),

  sortBased:
    Joi.string().valid('name', 'created')
    .when('$function', { 
      is: Joi.valid('list', 'listPublic', 'getFromVerification'), 
      then: Joi.required() 
    }),

  order:
    Joi.string().valid('1', '-1')
    .when('$function', { 
      is: Joi.valid('list', 'listPublic', 'getFromVerification'), 
      then: Joi.required() 
    }),

  lastValue:
    Joi.string().min(1).max(29),

  lastId:
    Joi.objectId()
    
}).with('lastValue', 'lastId');

module.exports = { validateAgency }