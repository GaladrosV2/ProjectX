# API Endpoints (stub)

## Auth
- POST `/api/auth/login`
- POST `/api/auth/register`

## Chat
- WS `room:<channel_id>`
- REST `/api/messages`

## Voice/Video Signaling
- WS `voice:<channel_id>`
- REST `/api/sfu/join`

## File Uploads
- POST `/api/upload` (presigned URL)

## Presence
- Phoenix.Presence tracking
