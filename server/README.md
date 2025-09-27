# Ludo Backend (Express + Socket.IO)

This backend is fully isolated from the frontend and can be deployed independently.

Local run:
- node server/server.js
- Configure the frontend to point to this server via NEXT_PUBLIC_SOCKET_URL

Environment variables:
- PORT (default 4000)
- MONGO_URI (required for persistence)
- LOG_DIR (default logs)
- SOCKET_CORS_ORIGIN (default *)
- SCORE_COMBO_WINDOW_MS (default 10000)

Client configuration:
- Set NEXT_PUBLIC_SOCKET_URL in the frontend to this server's public URL, e.g. https://api.example.com

Run locally:
- node server/server.js

Socket rooms:
- game:join { roomId, playerId, playerName, pawns: string[] }
- game:move { roomId, playerId, pawnId, steps }
- game:capture { roomId, striker: {playerId, pawnId}, victim: {playerId, pawnId} }
- game:end { roomId }

Emits:
- game:scores { [playerId]: total }
- game:move:ack
- game:capture:ack
- game:ended
