/**
 * MongoDB Connection Manager with Caching
 * 
 * This module implements a connection manager for MongoDB using Mongoose with global caching.
 * It's designed specifically for serverless environments like Next.js API routes.
 * 
 * Key Features:
 * - Reuses existing connections across function invocations
 * - Prevents multiple concurrent connections
 * - Persists cache across hot reloads in development
 * - Handles connection failures gracefully
 * 
 * How it works:
 * 1. Validates MONGODB_URI environment variable
 * 2. Returns cached connection if it exists
 * 3. Creates connection promise if none exists
 * 4. Awaits and caches the connection
 * 5. Clears promise cache on errors
 * 
 * The global cache structure:
 * - conn: Stores the active Mongoose connection
 * - promise: Stores the connection promise to prevent duplicate attempts
 * 
 * Benefits:
 * - Optimizes performance in serverless environments
 * - Prevents connection leaks during development
 * - Ensures single connection per application instance
 */

import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;



declare global {
    var mongooseCache: {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
    };
}

let cached = global.mongooseCache;

if (!cached) {
    cached = global.mongooseCache = { conn: null, promise: null };
}

export const connectToDatabase = async () => {
    if(!MONGODB_URI) throw new Error('Please define the MONGODB_URI environment variable inside .env.local');

    if(cached.conn) return cached.conn;

    if(!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI, {
            bufferCommands: false // Disable mongoose buffering
        });

    }

    try {
        cached.conn = await cached.promise;

    } catch (err) {
        cached.promise = null;
        throw err;
    }

    console.log(`MongoDB connected: ${process.env.NODE_ENV}`);
    return cached.conn;
}