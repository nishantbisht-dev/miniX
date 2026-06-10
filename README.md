# miniX

miniX is a full-stack Twitter/X-style social app built with:

- Frontend: Next.js, TypeScript, Tailwind CSS, Firebase Authentication
- Backend: Node.js, Express.js, MongoDB, Mongoose, Firebase Admin SDK
- Database: MongoDB Atlas
- Authentication: Firebase Auth

## Folder structure

```txt
miniX
├── frontend
└── backend
```

## Run backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

## Run frontend

```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

## Important

Firebase is used only for authentication. Application data is stored in MongoDB through the Express backend.

## Backend env

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
MONGO_URI=your_mongodb_uri
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY\n-----END PRIVATE KEY-----\n"
```

## Frontend env

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

## Author

Nishant Bisht
