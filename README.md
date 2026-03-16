# IPChat

A room-based instant messenger — anyone with the same room code shares a chat. No login, no accounts, no history saved to disk.

Inspired by [ipchat.in](https://ipchat.in), built from scratch with Node.js + Socket.io.

---

## Features

- Real-time messaging via WebSockets
- No login — just pick a username and a room code
- Room-based — use any string (IP address, keyword, shared secret) as a room
- Messages are wiped as soon as the last person leaves the room
- Live user presence sidebar
- Typing indicators
- Responsive (mobile-friendly)
- Dark terminal-style UI

---

## Getting Started

### Prerequisites

- Node.js >= 16

### Install & Run

```bash
npm install
npm start
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

### Dev mode (auto-restart on file changes)

```bash
npm run dev
```

---

## How It Works

1. Enter a **username** and a **room code**
2. The server creates (or joins) a Socket.io room with that code
3. All messages are broadcast in real-time to everyone in the room
4. When the **last user leaves**, all messages in that room are immediately deleted

There is no database. All state lives in memory.

---

## Project Structure

```
ipchat/
├── server.js       # Express + Socket.io backend
├── index.html      # Full frontend (served as static file)
├── package.json
└── README.md
```

---

## Deployment

### Railway / Render / Fly.io

Push this repo and point the platform to it. The `PORT` environment variable is respected automatically.

### Self-hosted (VPS)

```bash
npm install
PORT=80 node server.js
```

Or use PM2 to keep it running:

```bash
npm install -g pm2
pm2 start server.js --name ipchat
pm2 save
```

---

## Stack

| Layer | Tech |
|---|---|
| Runtime | Node.js |
| HTTP server | Express |
| WebSockets | Socket.io |
| Storage | In-memory (no DB) |
| Frontend | Vanilla HTML / CSS / JS |

---

## License

MIT
