# Vela - Web3 Super App

A seamless Web3 platform that makes crypto accessible to everyone. Built on Base with cross-chain capabilities.

## 🚀 Live URLs

- **Frontend**: [https://vela-goldman.vercel.app/](https://vela-goldman.vercel.app/)
- **Backend API**: [https://vela-production-804d.up.railway.app/](https://vela-production-804d.up.railway.app/)

## ✨ Features

- **Predictions**: Bet on real-world events via Polymarket (Polygon)
- **DeFi**: Earn yield on idle USDC via Aave (Base)
- **Education**: Learn Web3 with Goldman, our AI tutor
- **Gasless Experience**: $1 minimum balance reserve (like traditional banking)
- **Cross-Chain**: Seamless bridging from Base to Polygon
- **Coinbase Pay**: Easy fiat onramp

## 🏗️ Architecture

### Networks
- **Base Mainnet**: Primary network for DeFi, general app features
- **Polygon**: Prediction markets (Polymarket)

### Dual Wallet System
- **Main Wallet (Base)**: Primary wallet for Aave and general use
- **Prediction Wallet (Polygon)**: Pre-funded wallet for instant Polymarket trades

## 🛠️ Tech Stack

### Frontend
- React + Vite
- Tailwind CSS (glass morphism design)
- Privy (wallet auth, embedded wallets)
- Viem (blockchain interactions)
- Vercel hosting

### Backend
- Node.js + Express
- Supabase (PostgreSQL)
- OpenRouter (AI - Gemini)
- Railway hosting

### Blockchain
- Base (primary network)
- Polygon (predictions)
- Aave V3 (DeFi)
- Socket API (cross-chain bridging)

## 📦 Setup

### Environment Variables

#### Frontend (Railway)
```env
VITE_API_URL=https://vela-production-804d.up.railway.app
VITE_PRIVY_APP_ID=your_privy_app_id
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_COINBASE_APP_ID=your_coinbase_app_id
```

#### Backend (Railway)
```env
PORT=3001
BASE_RPC_URL=https://mainnet.base.org
POLYGON_RPC=https://polygon-rpc.com
SOCKET_API_KEY=your_socket_api_key
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
OPENROUTER_API_KEY=your_openrouter_api_key
```

### Database Schema

Create the `user_wallets` table in Supabase:

```sql
CREATE TABLE user_wallets (
  user_id UUID REFERENCES users(id) PRIMARY KEY,
  base_address TEXT,
  polygon_address TEXT,
  polygon_private_key TEXT, -- Encrypt in production!
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 🚀 Development

```bash
# Install dependencies
npm install

# Run frontend
npm run dev

# Run backend
npm run server
```

## 📝 Key Features

### Minimum Balance Reserve
- $1 always reserved for transaction fees (familiar from traditional banking)
- Users see "Available Balance" (spendable) vs "Total Balance"
- Enforced across all operations

### Pre-Funding Flow
- Users fund prediction wallet when entering Markets page
- Once funded, all trades execute instantly (no bridging delay)
- Seamless cross-chain experience

### Crypto-Invisible Design
- No blockchain terminology in user-facing UI
- All amounts shown in USD
- Gas fees handled automatically

## 🔗 API Endpoints

- `GET /health` - Health check
- `GET /api/markets` - Fetch Polymarket markets
- `POST /api/bets/place` - Place a bet
- `GET /api/bets/positions/:address` - Get user positions
- `GET /api/aave/apy` - Get Aave APY
- `POST /api/aave/deposit` - Deposit to Aave
- `POST /api/aave/withdraw` - Withdraw from Aave
- `POST /api/bridge/base-to-polygon` - Bridge USDC to Polygon
- `GET /api/bridge/status/:txHash` - Check bridge status
- `POST /api/ai-tutor/chat` - Chat with AI tutor

## 📄 License

Private
