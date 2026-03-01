# The Bamboo Nation - Reservation System

A reservation web app for The Bamboo Nation restaurant (Jaipur). Built with Next.js 14, Tailwind CSS, and Firebase Firestore.

## Features

- **Public Reservation Page** (`/reserve`) — Guests can book a table with name, phone, date, time, party size, occasion, and special requests
- **Admin Dashboard** (`/admin`) — View all reservations, filter by source, update status (Confirm / Cancel), view full details including chat summaries
- **API Routes** — REST API for creating, listing, and updating reservations
- **WhatsApp Integration Ready** — Reservations can be tagged with `?source=whatsapp` query param

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create a Firebase project

1. Go to [Firebase Console](https://console.firebase.google.com/) and click **Add project**
2. Give your project a name and follow the setup wizard
3. Once created, click **Build > Firestore Database** in the left sidebar
4. Click **Create database**, choose a location, and start in **production mode** (or test mode for development)

### 3. Get Firebase client credentials

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Under **General**, scroll to **Your apps** and click the web icon (`</>`) to register a web app
3. Copy the config values: `apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId`, `appId`

### 4. Set up a service account for the Admin SDK

1. In Firebase Console, go to **Project Settings > Service accounts**
2. Click **Generate new private key** — this downloads a JSON file
3. From that JSON file, copy `project_id`, `client_email`, and `private_key`

### 5. Configure environment variables

Copy the example env file and fill in your Firebase credentials:

```bash
cp .env.local.example .env.local
```

```
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
FIREBASE_ADMIN_PROJECT_ID=your-project-id
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
```

> **Note:** Wrap `FIREBASE_ADMIN_PRIVATE_KEY` in double quotes and keep the `\n` escape sequences.

### 6. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Pages

| Path | Description |
|------|-------------|
| `/` | Landing page with link to reservation form |
| `/reserve` | Public reservation form |
| `/reserve?source=whatsapp` | Reservation form with WhatsApp source tracking |
| `/admin` | Admin dashboard for managing reservations |

## API Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/reservations` | Create a new reservation |
| `GET` | `/api/reservations` | List all reservations (optional `?source=` filter) |
| `PATCH` | `/api/reservations/[id]` | Update reservation status |

## Tech Stack

- **Next.js 14** (App Router)
- **Tailwind CSS** (bamboo-themed design)
- **Firebase Firestore** (NoSQL database)
- **Firebase Admin SDK** (server-side database access)
- **TypeScript**
