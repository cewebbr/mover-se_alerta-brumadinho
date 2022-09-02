const Joi = require('joi');

const validateDenunciation = Joi.object({

  id: 
    Joi.objectId()
    .when('$function', { 
      is: Joi.valid(
        'getLikes',
        'comment', 
        'removeComment', 
        'like', 
        'removeLike', 
        'updateAuditor', 
        'updatePublisher', 
        'removeDenunciation'
      ), 
      then: Joi.required() 
    }),
  
  token: 
    Joi.string()
    .regex(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/=]*$/)
    .when('$function', { 
      is: Joi.valid('like', 'removeLike', 'comment'), 
      then: Joi.required()
    })
    .when('$function', { 
      is: Joi.valid('add'), 
      then: Joi.when('anonymous', {
        is: Joi.valid(false),
        then: Joi.required()
      })
    }),

  searchId:
    Joi.string().length(5)
    .when('$function', { 
      is: Joi.valid('getFromSearchId'), 
      then: Joi.required() 
    }),
  
  uf: 
    Joi.string().length(2).valid('MG')
    .when('$function', { 
      is: Joi.valid(/*'add', */'getFromCity', 'getFromStatusAndCity'), 
      then: Joi.required() 
    }),
  
  city:
    Joi.string().min(4).max(50).valid('Brumadinho')
    .when('$function', { 
      is: Joi.valid(/*'add', */'getFromCity', 'getFromStatusAndCity'), 
      then: Joi.required() 
    }),
  
  email: 
    Joi.string().email()
    .when('$function', { 
      is: Joi.valid('getFromEmail', 'getFromEmailAndStatus'), 
      then: Joi.required() 
    }),

  status:
    Joi.string().valid('unverified', 'accepted', 'rejected')
    .when('$function', { 
      is: Joi.valid('getFromStatusAndCity', 'updateAuditor', 'getFromEmailAndStatus'), 
      then: Joi.required() 
    }),

  category:
    Joi.objectId()
    .when('$function', { 
      is: Joi.valid('add'), 
      then: Joi.required() 
    }),

  title:
    Joi.string().min(2).max(100)
    .when('$function', { 
      is: Joi.valid('add'), 
      then: Joi.required() 
    }),
  
  description:
    Joi.string().min(2).max(500)
    .when('$function', { 
      is: Joi.valid('add', 'comment'), 
      then: Joi.required() 
    }),

  anonymous:
    Joi.boolean()
    .when('$function', { 
      is: Joi.valid('add'), 
      then: Joi.required() 
    }),

  media:
    Joi.array()
    .items(Joi.string().uri())
    .min(0).max(10),

  location:
    Joi.object().keys({
      type: Joi.string().valid('Point'), 
      coordinates: Joi.array().items(Joi.number()).length(2)
    })
    .when('$function', { 
      is: Joi.valid('add'), 
      then: Joi.required() 
    }),

  comment:
    Joi.objectId()
    .when('$function', { 
      is: Joi.valid('removeComment'), 
      then: Joi.required() 
    }),

  rejection_reason:
    Joi.string().min(2).max(500)
    // .valid('1', '2', '3', '4')
    .when('$function', { 
      is: Joi.valid('updateAuditor'), 
      then: Joi.when('status', {
        is: Joi.valid('rejected'),
        then: Joi.required()
      })
    }),

  sortBased:
    Joi.string().valid('relevance', 'created')
    .when('$function', { 
      is: Joi.valid('getFromCity', 'list', 'getFromStatus', 'getFromEmail'), 
      then: Joi.required() 
    }),

  order:
    Joi.string().valid('1', '-1')
    .when('$function', { 
      is: Joi.valid('getFromCity', 'list', 'getFromStatus', 'getFromEmail'), 
      then: Joi.required() 
    }),

  lastValue:
    Joi.string().min(1).max(29),

  lastId:
    Joi.objectId()

}).with('lastValue', 'lastId');

module.exports = { validateDenunciation }