## Tether Challenge - Cryptocurrency Data Gathering Solution

### 📌 Overview
This project is a cryptocurrency data gathering solution built using Hyperswarm RPC and Hypercores. It fetches price data from CoinGecko, calculates the average price from top 3 exchanges, stores it in Hyperbee, and exposes it via an RPC server with the following methods:

- `getLatestPrices`: Fetches most recent cryptocurrency prices.
- `getHistoricalPrices`: Retrieves historical price data.

---


### 📂 Project Structure
```
📦 tether-project
 ┣ 📂 src
 ┃ ┣ 📜 fetcher.js            # Fetch prices from CoinGecko API
 ┃ ┣ 📜 storage.js            # Storage with Hyperbee
 ┃ ┣ 📜 rpcServer.js          # Server file
 ┃ ┣ 📜 rpcClient.js          # Client file
 ┃ ┣ 📜 scheduler.js          # Schedules periodic price updates
 ┣ 📜 .env                    # ENV variables
 ┣ 📜 .gitignore
 ┣ 📜 README.md
 ┣ 📜 package.json
 ┣ 📜 package-lock.json
```

---

### 🔧 Installation & Setup

#### 1️⃣ Clone  repository
```sh
git clone https://github.com/kishan-ghetiya/tether-challenge.git
cd tether-project
```

#### 2️⃣ Install dependencies
```sh
npm install
```

#### 3️⃣ Run RPC Server
```sh
npm run server
```
- The server will generate a **public key**. Note it down.

#### 4️⃣ Run  RPC Client
Update `rpcClient.js` with the correct **serverPublicKey**:
```js
const serverPublicKey = '<SERVER_PUBLIC_KEY>';
```
Then run client:
```sh
npm run client

```

#### 5️⃣ Run  Scheduler
```sh
npm run scheduler

```

---

### 🐛 Troubleshooting

#### 1️⃣ Error: `REQUEST_ERROR: Request failed`
✔ Ensure the **RPC server is running** before the client.

✔ Verify the **public key** in `rpcClient.js` matches one in `rpcServer.js`.

✔ Check if **Hyperswarm is reachable** (restart if needed).

#### 2️⃣ Data Not Updating?
✔ Ensure `scheduler.js` is running to fetch prices regularly.

✔ Restart server if Hyperbee is not storing data correctly.

---

### ✨ Author
**Kishan Ghetiya** - *Senior Full Stack Developer* 🚀

