import Joi from "joi";

 export const listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
    price: Joi.number().required().min(0),
//     image: Joi.object({
//       url: Joi.string().allow("", null),
//       filename: Joi.string().allow("", null)
//     }).optional(),
//   }).required(),
// });

 image: Joi.alternatives().try(
      Joi.object({
        url: Joi.string().uri().allow("", null),
        filename: Joi.string().allow("", null),
      }),
      Joi.string().uri().allow("", null),
      Joi.string().allow("", null)
    ).optional(),

  }).required(),
});



 export const reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    comment: Joi.string().required(),
  }).required(),
});

