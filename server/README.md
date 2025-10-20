# BetterAuth Server for InvoiceSnap

This server provides authentication services for the InvoiceSnap application using betterAuth with PocketBase as the database backend and social logins (Google and GitHub).

## Prerequisites

1. PocketBase instance running on http://127.0.0.1:8090
2. Node.js and npm installed
3. Google OAuth credentials
4. GitHub OAuth credentials

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables in `.env`:
   ```env
   # PocketBase
   POCKETBASE_URL=http://127.0.0.1:8090
   POCKETBASE_ADMIN_EMAIL=admin@example.com
   POCKETBASE_ADMIN_PASSWORD=your_admin_password

   # OAuth Providers
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret

   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret

   # BetterAuth
   BETTER_AUTH_SECRET=your_secret_key_here_at_least_32_characters
   BETTER_AUTH_URL=http://localhost:3001

   # App URL
   APP_URL=http://localhost:5173
   ```

3. Set up PocketBase collections:
   ```bash
   npm run setup
   ```

## Running the Server

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm run build
npm start
```

The server will run on port 3001 by default.

## API Endpoints

- `GET /health` - Health check endpoint
- `/auth/*` - BetterAuth authentication endpoints

## OAuth Setup

### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3001/auth/callback/google`

### GitHub OAuth

1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Create a new OAuth App
3. Set Authorization callback URL: `http://localhost:3001/auth/callback/github`

## PocketBase Collections

The server requires the following collections in PocketBase:

### Users Collection
- email (email, required, unique)
- name (text, optional)
- avatar_url (url, optional)
- email_verified (bool, optional, default: false)

### Sessions Collection
- user_id (relation to users, required)
- token (text, required, unique)
- expires_at (date, required)
- ip_address (text, optional)
- user_agent (text, optional)

### Accounts Collection
- user_id (relation to users, required)
- provider (text, required)
- provider_account_id (text, required)
- access_token (text, optional)
- refresh_token (text, optional)
- expires_at (date, optional)

## Architecture

The server consists of:

1. Express.js server with CORS configuration
2. BetterAuth configuration with social providers
3. Custom PocketBase adapter for database operations
4. Environment variable configuration

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure CORS is properly configured and the origin matches your React app URL
2. **OAuth Callbacks**: Verify redirect URIs match exactly in OAuth provider settings
3. **PocketBase Connection**: Check PocketBase is running and credentials are correct
4. **Environment Variables**: Ensure all required environment variables are set

### Debug Mode

Enable debug mode by setting:
```env
BETTER_AUTH_DEBUG=true
```

This will provide detailed logs for troubleshooting authentication flows.# invoice-snap
