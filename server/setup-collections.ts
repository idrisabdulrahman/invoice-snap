import PocketBase from 'pocketbase';
import dotenv from 'dotenv';

dotenv.config();

const pb = new PocketBase(process.env.POCKETBASE_URL);

async function setup() {
  await pb.admins.authWithPassword(
    process.env.POCKETBASE_ADMIN_EMAIL!,
    process.env.POCKETBASE_ADMIN_PASSWORD!
  );

  const collections = [
    {
      name: 'user',
      type: 'base',
      schema: [
        { name: 'email', type: 'email', required: true },
        { name: 'emailVerified', type: 'bool' },
        { name: 'name', type: 'text' },
        { name: 'image', type: 'url' },
      ],
    },
    {
      name: 'session',
      type: 'base',
      schema: [
        { name: 'userId', type: 'text', required: true },
        { name: 'expiresAt', type: 'date', required: true },
        { name: 'token', type: 'text', required: true },
        { name: 'ipAddress', type: 'text' },
        { name: 'userAgent', type: 'text' },
      ],
    },
    {
      name: 'account',
      type: 'base',
      schema: [
        { name: 'userId', type: 'text', required: true },
        { name: 'accountId', type: 'text', required: true },
        { name: 'providerId', type: 'text', required: true },
        { name: 'accessToken', type: 'text' },
        { name: 'refreshToken', type: 'text' },
        { name: 'expiresAt', type: 'date' },
      ],
    },
    {
      name: 'verification',
      type: 'base',
      schema: [
        { name: 'identifier', type: 'text', required: true },
        { name: 'value', type: 'text', required: true },
        { name: 'expiresAt', type: 'date', required: true },
      ],
    },
  ];

  for (const collection of collections) {
    try {
      await pb.collections.create(collection);
      console.log(`✓ Created collection: ${collection.name}`);
    } catch (error: any) {
      console.log(`Collection ${collection.name} might already exist:`, error.message);
    }
  }
}

setup();