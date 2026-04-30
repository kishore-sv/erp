import createServer from "./server.js";
import * as dotenv from "dotenv";
import "./workers/emailWorker.js";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express4";
import { typeDefs } from "./graphql/typeDefs.js";
import { resolvers } from "./graphql/resolvers.js";

dotenv.config();

const bootstrap = async () => {
  const app = createServer();
  const PORT = process.env.PORT || 8000;

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();

  app.use("/graphql", expressMiddleware(server, {
    context: async ({ req }) => ({ token: req.headers.token }),
  }));

  app.listen(PORT, () => {
    console.log(`Server ready at http://localhost:${PORT}`);
    console.log(`GraphQL Server ready at http://localhost:${PORT}/graphql`);
  });
};

bootstrap().catch((err) => {
  console.error("Failed to start server", err);
});
