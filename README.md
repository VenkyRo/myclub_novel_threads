# Novel Threads

A full-stack Telugu novel publishing website built with React, Vite, Node.js, Express, MongoDB Atlas and Cloudinary.

## Included features

- Public novel browsing and searching
- Telugu-compatible reading interface using Noto Sans Telugu
- Published-only public chapter access
- Previous and next navigation based on the ordered published chapter list
- Unlimited-length chapter content stored as a MongoDB String without a small `maxlength`
- Reader registration, login, likes, bookmarks and moderated comments
- Admin dashboard analytics
- Admin novel create, publish and unpublish APIs
- Admin chapter create, edit, publish, unpublish and delete APIs
- User ban checks against the current MongoDB record on every protected request
- Comment approval APIs
- Cloudinary-ready cover image upload
- Render backend and Vercel SPA deployment configuration

## Folder structure

```text
novel-threads-platform/
├── client/
│   ├── src/
│   ├── .env.example
│   ├── vercel.json
│   └── package.json
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── scripts/
│   ├── utils/
│   ├── .env.example
│   ├── package.json
│   └── server.js
└── README.md
```

## Local setup

### 1. Create your MongoDB Atlas connection string

Create a free MongoDB Atlas cluster, create a database user, allow your IP address under Network Access, then copy the Node.js connection string.

### 2. Create Cloudinary credentials

Create a Cloudinary account. Copy your Cloud Name, API Key and API Secret from the Cloudinary dashboard.

### 3. Configure the backend

```bash
cd server
cp .env.example .env
```

Fill the `.env` file with your own private values:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=use_a_long_random_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
ADMIN_NAME=your_admin_name
ADMIN_EMAIL=your_admin_email
ADMIN_PASSWORD=your_private_admin_password
```

Run the backend:

```bash
npm install
npm run create-admin
npm run dev
```

Verify the health endpoint:

```text
http://localhost:5000/api/health
```

Expected response:

```json
{
  "success": true,
  "message": "Novel Threads API is running"
}
```

### 4. Configure the frontend

```bash
cd ../client
cp .env.example .env
```

Use:

```env
VITE_API_URL=http://localhost:5000/api
```

Run the frontend:

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

## Important API endpoints

### Public

- `GET /api/health`
- `GET /api/novels`
- `GET /api/novels/:slug`
- `GET /api/chapters/:chapterId`
- `GET /api/chapters/:chapterId/comments`

### Authentication

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Readers

- `POST /api/chapters/:chapterId/like`
- `DELETE /api/chapters/:chapterId/like`
- `POST /api/bookmarks/:chapterId`
- `DELETE /api/bookmarks/:chapterId`
- `GET /api/bookmarks`
- `POST /api/chapters/:chapterId/comments`

### Admin

- `GET /api/admin/dashboard`
- `GET /api/admin/novels`
- `POST /api/admin/novels`
- `PUT /api/admin/novels/:novelId`
- `PATCH /api/admin/novels/:novelId/publish`
- `DELETE /api/admin/novels/:novelId`
- `GET /api/admin/novels/:novelId/chapters`
- `POST /api/admin/novels/:novelId/chapters`
- `PUT /api/admin/chapters/:chapterId`
- `PATCH /api/admin/chapters/:chapterId/publish`
- `DELETE /api/admin/chapters/:chapterId`
- `GET /api/admin/users`
- `PATCH /api/admin/users/:userId/ban`
- `PATCH /api/admin/users/:userId/unban`
- `DELETE /api/admin/users/:userId`
- `GET /api/admin/comments`
- `PATCH /api/admin/comments/:commentId/approve`
- `DELETE /api/admin/comments/:commentId`

## Render backend deployment

1. Push the project to GitHub.
2. Create a Render Web Service from the repository.
3. Choose `server` as the root directory.
4. Use `npm install` as the build command.
5. Use `npm start` as the start command.
6. Add every backend environment variable from `server/.env.example` using private values.
7. Set `NODE_ENV=production`.
8. Open `https://your-render-service.onrender.com/api/health` and confirm that the API is running.
9. Run the admin creation script locally with the production MongoDB URI, or use Render Shell and execute `npm run create-admin`.

## Vercel frontend deployment

1. Import the GitHub repository into Vercel.
2. Choose `client` as the root directory.
3. Use `npm run build` as the build command.
4. Use `dist` as the output directory.
5. Add `VITE_API_URL=https://your-render-service.onrender.com/api`.
6. Deploy the frontend.
7. The included `client/vercel.json` rewrite ensures React Router pages still work after refresh.
8. Return to Render and set `CLIENT_URL=https://your-vercel-domain.vercel.app`.

## Manual test checklist

- Browse only published novels while logged out.
- Confirm draft novels and draft chapters are not publicly accessible.
- Save a Telugu chapter longer than 10,000 characters.
- Confirm line breaks remain visible on the reading page.
- Publish chapters 1 and 3 while chapter 2 remains draft. Confirm Next skips chapter 2.
- Delete a published chapter and confirm navigation still works.
- Register a reader account.
- Like a chapter twice and confirm only one like is stored.
- Remove a like.
- Add and remove a bookmark.
- Submit a comment and confirm it is hidden until approved.
- Approve the comment as admin and confirm it becomes public.
- Ban the reader and confirm the old JWT stops working for protected actions.
- Confirm Vercel page refreshes do not show a 404.

## Security note

Never commit `.env` files. Rotate any MongoDB password, Cloudinary secret, JWT secret or admin password that has been pasted into a public message or uploaded file.
