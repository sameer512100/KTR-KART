# KTR-KART Backend

Backend for SRM student mini-commerce app.

## Features
- SRM-only signup (`@srmist.edu.in`) with OTP verification
- Sign in with JWT auth
- Products API with hostel filtering
- Image upload for product listing
- One-to-one chat using Socket.IO

## Allowed Hostels
- paari
- kaari
- oori
- adhiyaman
- nelson mandela
- manoranjitham
- mullai
- sannasi a
- agasthiyar
- began

## Setup
1. Install dependencies:
```bash
npm install
```
2. Copy env file:
```bash
copy .env.example .env
```
3. Update `.env` values.
4. Start server:
```bash
npm run dev
```

## API
### Auth
- `POST /api/auth/signup/initiate`
  - body: `{ name, email, password, hostel, roomNumber }`
- `POST /api/auth/signup/verify`
  - body: `{ email, otp }`
- `POST /api/auth/signin`
  - body: `{ email, password }`
- `GET /api/auth/me`
  - header: `Authorization: Bearer <token>`

### Products
- `GET /api/meta/hostels`
- `GET /api/products?hostel=paari`
- `GET /api/products/:id`
- `POST /api/products`
  - header: `Authorization: Bearer <token>`
  - form-data fields:
    - `title` (string)
    - `description` (string, optional)
    - `category` (string)
    - `price` (number)
    - `hostel` (string, optional, defaults to user hostel)
    - `image` (file, required)

### Chat (REST)
- `GET /api/chats/users`
- `GET /api/chats/:userId`
- `POST /api/chats/:userId`
  - body: `{ text, productId? }`

All chat REST endpoints need `Authorization: Bearer <token>`.

## Socket.IO
Connect with auth token:
```js
const socket = io("http://localhost:5000", {
  auth: { token }
});
```

Events:
- client -> server: `chat:send`
  - payload: `{ receiverId, text, productId? }`
- server -> client: `chat:message`
  - payload: message object
- server -> client: `chat:error`
  - payload: `{ error }`

## Notes
- Uploaded images are served from `/uploads/<filename>`.
- SMTP settings are configured in `.env` for live OTP delivery to student email inboxes.
