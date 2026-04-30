import redis from "../db/redis.js";

export const resolvers = {
  Query: {
    hello: () => "Hello from GraphQL!",
    redisTest: async () => {
      await redis.set("test_key", "Redis works with GraphQL!");
      const value = await redis.get("test_key");
      return value;
    },
  },
};
