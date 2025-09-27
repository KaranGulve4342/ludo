# Microservices Setup (React + Vite client, Node + Express server)

## Prereqs
- Node 18+

## 1) Backend (server/)
cp server/.env.example server/.env
# edit CORS_ORIGIN if needed
cd server
npm install
npm run dev
# Server: http://localhost:4000

## 2) Frontend (client/)
cp client/.env.example client/.env
# edit VITE_API_BASE_URL if needed
cd client
npm install
npm run dev
# Client: http://localhost:5173

Open the client in a browser, ensure the backend is running, and try incrementing scores.
