# InvoiceSnap - Fast Invoicing Application

InvoiceSnap is a modern, fast invoicing application built with React, TypeScript, and Vite. It features a bold, minimalist design and focuses on creating professional invoices in under 90 seconds.

## Features

- **Fast Invoicing**: Create professional invoices in under 90 seconds
- **Social Authentication**: Login with Google or GitHub (no passwords required)
- **Modern Design**: Bold, minimalist interface with dark/light mode support
- **Client Management**: Store and reuse client information
- **Professional Templates**: Pre-designed invoice templates that work
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **Authentication**: betterAuth with social providers (Google, GitHub)
- **Database**: PocketBase
- **Backend**: Express.js server for authentication

## Getting Started

### Prerequisites

1. Node.js and npm installed
2. PocketBase instance running
3. Google OAuth credentials (for development)
4. GitHub OAuth credentials (for development)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the authentication server:
   ```bash
   cd server
   npm install
   cp .env.example .env
   # Update .env with your credentials
   npm run setup
   npm run dev
   ```

4. In a new terminal, start the frontend:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## Authentication

InvoiceSnap uses betterAuth with social providers for authentication. Users can log in with their Google or GitHub accounts without needing to create a password.

### Setting up OAuth

#### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3001/auth/callback/google`

#### GitHub OAuth

1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Create a new OAuth App
3. Set Authorization callback URL: `http://localhost:3001/auth/callback/github`

## Project Structure

```
invoice-snap/
├── server/                 # Authentication server
│   ├── src/
│   │   ├── auth.ts        # betterAuth configuration
│   │   ├── index.ts       # Express server
│   │   └── pocketbase-adapter.ts # PocketBase adapter
│   ├── setup-collections.js # Script to set up PocketBase collections
│   └── README.md          # Server documentation
├── src/
│   ├── components/        # React components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility libraries
│   └── entities/         # Data entities
├── public/               # Static assets
└── docs/                 # Documentation
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Server Scripts

- `npm run dev` - Start auth server in development mode
- `npm run build` - Build auth server
- `npm run start` - Start auth server in production mode
- `npm run setup` - Set up PocketBase collections

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
