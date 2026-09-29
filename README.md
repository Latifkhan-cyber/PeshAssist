# PeshAssist (AI Peshawar Assistant) 🌸

An intelligent, conversational local guide and discovery web application specifically designed for **Peshawar, Khyber Pakhtunkhwa, Pakistan**.

Built with **React, Vite, Tailwind CSS, Node.js, Express REST API, PostgreSQL/Supabase**, and **Google Gemini API** with anti-hallucination grounding.

---

## 🌟 Key Features

1. **Conversational AI Guide**:
   - Understands English, Urdu, and Roman Urdu (*"University Road ke paas acha family restaurant"*, *"Hayatabad mein emergency hospital"*, *"Saddar mein laptop repair"*).
   - Anti-hallucination guarantee: ground-truth local database context is passed with function calling before generating responses.
   - Interactive Place Cards embedded directly inside chat messages.

2. **Categorized Peshawar Discovery**:
   - Restaurants & Dining (Charsi Tikka Namak Mandi, Jalil Chapli Kabab, Habibi Hayatabad, Jan's Deli Saddar, Chief Burger)
   - Hospitals & 24/7 Emergency (KTH, HMC, Lady Reading Hospital, RMI)
   - Historic Monuments & Tourism (Bala Hissar Fort, Peshawar Museum, Mahabat Khan Mosque, Bab-e-Khyber)
   - Shopping & Bazaars (Deans Trade Center, Qissa Khwani Bazaar)
   - Tech & Hardware Repair (Deans Laptop & Motherboard care, Tipu Sultan Mobile Market)
   - Transit & Transport (Zu Peshawar BRT stations, Bacha Khan International Airport)

3. **Interactive OpenStreetMap / Leaflet Maps**:
   - Direct GPS coordinates and one-click Google Maps turn-by-turn directions.

4. **Reviews & Personal Wishlist**:
   - Authenticated user reviews with star ratings.
   - 1-click bookmarking of favorites.

5. **Admin Control Center**:
   - Add, edit, delete, and verify Peshawar places.
   - Live entity metrics and statistics.

---

## 🚀 Running Locally

### 1. Start the Express Backend (Port 5000)
```bash
cd server
npm install
npm run dev
```

### 2. Start the React Frontend (Port 5173)
```bash
cd client
npm install
npm run dev
```

Open your browser at: **[http://localhost:5173](http://localhost:5173)**

---

## 🔑 Environment Variables

### Backend (`server/.env`):
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Optional: Google Gemini API Key (hybrid fallback engine works automatically if omitted)
GEMINI_API_KEY=your_gemini_key

# Optional: Remote Supabase DB (local high-fidelity store works automatically if omitted)
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## 📁 Project Architecture

```text
PeshAssist/
├── client/                      # React + Vite Frontend
│   ├── src/
│   │   ├── components/          # Navbar, Footer, PlaceCard, ChatPlaceCard, MapView, ReviewModal, PlaceModal
│   │   ├── pages/               # Home, ChatPage, ExplorePage, PlaceDetailsPage, FavoritesPage, AdminDashboard, LoginPage
│   │   ├── layouts/             # MainLayout
│   │   ├── context/             # AuthContext, ChatContext, FavoritesContext
│   │   ├── services/            # api.js (Axios API Client)
│   │   ├── App.jsx              # React Router Entry
│   │   └── index.css            # Tailwind styles
│   └── package.json
│
├── server/                      # Node.js + Express REST Backend
│   ├── controllers/             # chatController, placesController, reviewsController, favoritesController, adminController
│   ├── routes/                  # api.js (Unified REST Endpoints)
│   ├── services/                # geminiService.js, searchService.js
│   ├── data/                    # peshawarData.js (Peshawar seed dataset), schema.sql
│   ├── config/                  # supabase.js
│   ├── server.js                # Express Application
│   └── package.json
└── README.md
```
