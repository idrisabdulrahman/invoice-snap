import { betterAuth } from 'better-auth';
import { pocketbaseAdapter } from './pocketbase-adapter';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('Initializing BetterAuth...');

console.log('Creating PocketBase adapter factory...');

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET!,
  basePath: '/api/auth',
  trustedOrigins: [
    process.env.APP_URL || 'http://localhost:5173',
    'http://localhost:3001',
    'http://127.0.0.1:3001',
  ],
  
  database: pocketbaseAdapter({
    url: process.env.POCKETBASE_URL!,
    adminEmail: process.env.POCKETBASE_ADMIN_EMAIL!,
    adminPassword: process.env.POCKETBASE_ADMIN_PASSWORD!,
  }),
  
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      enabled: true,
      scope: ['email', 'profile'],
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      enabled: true,
      scope: ['user:email'],
    },
  },
  
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },
  
  account: {
    accountLinking: {
      enabled: true,
    },
  },
  
  // Add error handling for development
  development: process.env.NODE_ENV === 'development',
});

console.log('BetterAuth initialized successfully');