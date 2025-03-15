export const envsConfig = () => ({
  authorizationToken: process.env.AUTHORIZATION_TOKEN,
  graphqlUrl: process.env.GRAPHQL_URL,
  filePath: process.env.FILE_PATH,
  // AWS
  awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
  awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  awsS3BucketName: process.env.AWS_S3_BUCKET_NAME,
  awsRegion: process.env.AWS_REGION,
});
