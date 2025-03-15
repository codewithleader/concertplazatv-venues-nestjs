import * as joi from 'joi';

export const joiSchema = joi.object({
  AUTHORIZATION_TOKEN: joi.string().required(),
  GRAPHQL_URL: joi.string().required(),
  FILE_PATH: joi.string().required(),
  // AWS
  AWS_ACCESS_KEY_ID: joi.string().required(),
  AWS_SECRET_ACCESS_KEY: joi.string().required(),
  AWS_S3_BUCKET_NAME: joi.string().required(),
  AWS_REGION: joi.string().required(),
});
