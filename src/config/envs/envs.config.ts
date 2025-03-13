export const envsConfig = () => ({
  authorizationToken: process.env.AUTHORIZATION_TOKEN,
  graphqlUrl: process.env.GRAPHQL_URL,
  filePath: process.env.FILE_PATH,
});
