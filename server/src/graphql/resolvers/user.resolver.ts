import { eq } from "drizzle-orm";
import { dbPrimary } from "../../db/index.js";
import { users } from "../../db/schema.js";

export const userResolvers = {
    Query: {
        // Fetch users with an optional limit parameter
        users: async (_: any, args: { limit?: number }) => {
            try {
                // Start building the query
                let query = dbPrimary
                    .select({
                        id: users.id,
                        name: users.name,
                        email: users.email,
                        role: users.role,
                        isActive: users.isActive,
                        createdAt: users.createdAt,
                    })
                    .from(users)
                    .$dynamic();

                // Apply limit modifier if provided in the GraphQL query arguments
                if (args.limit !== undefined && args.limit !== null) {
                    query = query.limit(args.limit);
                }

                const rawUsers = await query;

                // Map database outputs to match exact GraphQL specifications
                return rawUsers.map(user => ({
                    ...user,
                    isActive: user.isActive ?? true,
                    createdAt: user.createdAt ? new Date(user.createdAt).toISOString() : new Date().toISOString()
                }));
            } catch (error) {
                console.error("Error in users query resolver:", error);
                throw new Error("Failed to retrieve users list from database.");
            }
        },

        // Fetch a single user by UUID
        user: async (_: any, args: { id: string }) => {
            try {
                const result = await dbPrimary
                    .select({
                        id: users.id,
                        name: users.name,
                        email: users.email,
                        role: users.role,
                        isActive: users.isActive,
                        createdAt: users.createdAt,
                    })
                    .from(users)
                    .where(eq(users.id, args.id));

                const user = result[0];
                if (!user) return null;

                return {
                    ...user,
                    isActive: user.isActive ?? true,
                    createdAt: user.createdAt ? new Date(user.createdAt).toISOString() : new Date().toISOString()
                };
            } catch (error) {
                console.error(`Error fetching user with id ${args.id}:`, error);
                throw new Error(`Failed to retrieve user information.`);
            }
        },
    },
};
