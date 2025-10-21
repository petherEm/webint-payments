import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { connectToDatabase } from "@/database/mongoose";
import { nextCookies } from "better-auth/next-js";


let authInstance: ReturnType<typeof betterAuth> | null = null;


export const getAuth = async () => {
    if (authInstance) return authInstance;

    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;


    if(!db) throw new Error('Database connection is not established');

    authInstance = betterAuth({
        database: mongodbAdapter(db as any),
        cookies: nextCookies(),
        secret: process.env.BETTER_AUTH_SECRET,
        baseUrl: process.env.BETTER_AUTH_URL,
        emailAndPassword: {
            enabled: true,
            disableSignUp: false,
            requireEmailVerification: false,
            minPasswordLength: 8,
            maxPasswordLength: 128,
            autoSignIn: true,
          
        },
        plugins: [nextCookies()],
        // You can enable other authentication methods here
        // Other better-auth options can be added here
    });

    return authInstance;
}

export const auth = await getAuth();