import * as joi from 'joi';

export const joiSchema = joi.object({
  AUTHORIZATION_TOKEN: joi.string().required(),
  GRAPHQL_URL: joi.string().required(),
});
