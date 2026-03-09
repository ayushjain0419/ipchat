# IPChat

A room-based instant messenger — anyone with the same room code shares a chat.  
Inspired by [ipchat.in](https://ipchat.in), built from scratch with Node.js + Socket.io.

---

## Features

- ⚡ Real-time messaging via WebSockets
- 🔑 No login — just a username and a room code
- 🗂 Room-based — use any string (IP, keyword, secret) as a room
- 🕒 Messages persist for 24 hours (in-memory)
- 👥 Live user presence sidebar
- ✍️ Typing indicators
- 📱 Responsive (mobile-friendly)

---

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Run the server
```bash
npm start
```

### 3. Open in browser
```
http://localhost:3000
```

---

## How It Works

1. User enters a **username** and a **room code**
2. The server creates (or joins) a Socket.io room with that code
3. All messages in the room are broadcast to everyone in it
4. Messages are stored in memory and expire after 24 hours

---

## Deployment

### Railway / Render / Fly.io
Just point to this repo. The `PORT` env variable is respected automatically.

### Self-hosted (VPS)
```bash
# Install Node.js, then:
npm install
PORT=80 node server.js
# Or use PM2:
npm install -g pm2
pm2 start server.js --name ipchat
```

---

## Stack

| Layer | Tech |
|---|---|
| Runtime | Node.js |
| HTTP server | Express |
| WebSockets | Socket.io |
| Storage | In-memory (no DB needed) |
| Frontend | Vanilla HTML/CSS/JS |

---

## Customization Ideas

- Add **Redis** for persistent message storage across restarts
- Add **rate limiting** to prevent spam
- Add **end-to-end encryption** using the room code as a shared secret
- Add **file/image sharing**
- Add **notifications** via browser push API
