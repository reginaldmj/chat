## 🚀 Getting Started

### 1. Install dependencies

```bash
cd server && npm install
cd ../client && npm install
```

### 2. Start the server

```bash
cd server
npm start
# → http://localhost:3001
```

### 3. Start the React client

```bash
cd client
npm start
# → http://localhost:3000
```

The client proxies all `/api` requests to `localhost:3001` via `"proxy"` in `client/package.json`.

### 4. Register & start chatting

- Open http://localhost:3000
- Click **Register** to create your first account
- Have teammates register their own accounts
- Click **+** in the sidebar to start a DM or group conversation
