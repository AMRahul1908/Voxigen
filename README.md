# VOXIGEN — Vedic Astrology Web Application

> **“Discover Your Cosmic Blueprint.”**

Voxigen is a complete, production-grade Vedic astrology web application delivering degree-accurate birth chart calculations, interactive multi-style SVG Kundali charts (North, South, and East Indian), divisional vargas (D1, D9 Navamsa, D10 Dashamsa), 120-year Vimshottari Dasha timelines, planetary dignity tables, city autocomplete with historical time zones, MongoDB persistence, and publication-ready PDF exports.

---

## 🌟 Key Features

1. **Dual Astrology Engine Architecture**:
   - **Navamsha API Integration**: Full integration with the Navamsha REST API (`https://api.navamsha.in/api/v1/kundali/basic`) with secret backend key handling.
   - **High-Precision Astronomy Engine Fallback**: In the absence of an API key or upon network timeouts, seamless fallback to our built-in astronomical calculation engine powered by `astronomy-engine` (JPL/VSOP87 algorithms with Chitrapaksha / Lahiri Ayanamsha, true local sidereal time, and exact Ascendant/Lagna calculation).
   - **Integrity First**: Never fabricates or randomizes planetary positions.

2. **Interactive SVG Kundali Visualizer**:
   - **North Indian Diamond Chart**: Fixed houses, rotating signs, and clean planet glyph placements.
   - **South Indian Box Chart**: Clockwise fixed zodiac signs with Lagna indicator.
   - **East Indian Chart**: Traditional triangular geometry used in Eastern traditions.
   - **Divisional Charts (Vargas)**: Instant tab switching between D1 (Rashi), D9 (Navamsa), and D10 (Dashamsa).

3. **Complete Astrological Suite**:
   - **Janma Nakshatra & Pada**: In-depth analysis of Deity, Symbol, Lord, Gana, Nadi, Yoni, and Varna.
   - **Planetary Positions Table**: Graha, Vedic name, sign, lord, house, normalized degree, Nakshatra, Retrograde (R), Combust (C), and Dignity (Exalted, Debilitated, Own Sign).
   - **120-Year Vimshottari Dasha**: Accurate balance of Dasha at birth, active Mahadasha/Antardasha indicators, and complete 81-period timeline.
   - **Classical Vedic Yogas**: Evaluates Raja Yogas, Dhana Yogas, Gaja Kesari, Budhaditya, and Pancha Mahapurusha alignments.
   - **Graha Drishti**: Full planetary aspect tracking.

4. **Dedicated Pages**:
   - `/` — Homepage with Hero and visually prominent birth details form.
   - `/kundali/:id` — Dedicated Kundali results page with persistent URL retrieval.
   - `/free-kundali` — Free Kundali generation portal with educational guides.
   - `/horoscope` — Daily Vedic horoscope for all 12 Rashis based on planetary transits.
   - `/panchang` — Daily Vedic Panchang (Tithi, Nakshatra, Vara, Yoga, Karana, Rahu Kaal, Abhijit Muhurat).
   - `/compatibility` — 36-Point Ashtakoot Gun Milan calculator with Manglik dosha checks.
   - `/about`, `/privacy`, `/terms` — Story, principles, data privacy, and disclaimers.

5. **Utilities & Exports**:
   - **Download PDF**: Generates publication-grade, beautifully formatted PDF reports using `jsPDF`.
   - **Print**: Print-optimized stylesheet for physical or browser PDF printing.
   - **Share**: One-click URL copy and Web Share API integration.
   - **Edit Birth Details**: In-place modal to adjust time, date, or coordinates with automatic recalculation.

---

## 🎨 Visual Design System

- **Color Palette**:
  - Midnight Navy: `#101329`
  - Deep Indigo: `#211B45`
  - Royal Purple: `#4C2A85`
  - Antique Gold: `#D6B46A`
  - Warm Ivory: `#FFF8E9`
  - Lavender: `#E9E1F5`
- **Typography**:
  - Headings: *Playfair Display*
  - Body Text: *Inter*

---

## 🛠 Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Bundler**: Vite
- **Styling**: Tailwind CSS with custom cosmic theme
- **Routing**: React Router DOM (v7)
- **Icons**: Lucide React
- **Forms & Validation**: React Hook Form with Zod
- **PDF Generation**: jsPDF

### Backend
- **Runtime**: Node.js (v20+) with Express.js and TypeScript
- **Database**: MongoDB Atlas with Mongoose (with automatic in-memory fallback for offline dev)
- **Ephemeris Engine**: `astronomy-engine` (IAU/VSOP87 planetary algorithms)
- **Security**: CORS, Express Rate Limit, Zod request validators, centralized error handling

---

## 🚀 Quick Start Guide

### 1. Installation
Clone the repository and install all dependencies:
```bash
# From the root directory:
npm install
npm install --prefix server
npm install --prefix client
```

### 2. Environment Configuration

#### Backend (`server/.env`):
Create `server/.env` (or copy from `server/.env.example`):
```env
PORT=5000
CLIENT_URL=http://localhost:5173
MONGODB_URI=your_mongodb_atlas_connection_string
NAVAMSHA_API_KEY=your_navamsha_api_key_here
NODE_ENV=development
```
> *Note:* If `MONGODB_URI` is omitted, the server automatically operates in a resilient in-memory mode, ensuring full functionality during local development. If `NAVAMSHA_API_KEY` is omitted, the server uses the built-in astronomical Vedic calculation engine.

#### Frontend (`client/.env`):
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 3. Running the Application

To run both backend and frontend concurrently with hot-reloading:
```bash
npm run dev
```

Alternatively, run them separately:
```bash
# Terminal 1 (Backend):
npm run dev:server

# Terminal 2 (Frontend):
npm run dev:client
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Run with Docker Compose

Docker Compose runs the production-built React site behind Nginx, the Node API, and a MongoDB container with a persistent data volume.

1. Install Docker Desktop and make sure it is running.
2. Create a root `.env` from the safe example:
   ```bash
   cp .env.docker.example .env
   ```
3. Add your API/payment/email keys to `.env` as needed. The local MongoDB URI is already set in the example. To use MongoDB Atlas instead, replace `MONGODB_URI` with the Atlas connection string and URL-encode any reserved characters in its username/password.
4. Start the services from the project root:
   ```bash
   npm run docker:up
   ```
5. Open [http://localhost:8080](http://localhost:8080). API requests are routed internally through Nginx, and MongoDB data persists in the `voxigen-mongodb` Docker volume.

Useful commands:

```bash
npm run docker:logs
npm run docker:down
```

The API and database ports are not published directly to the host. For a public production deployment, put the site behind HTTPS and provide production credentials through the deployment platform’s secret manager. Do not commit `.env` or put server secrets in the client environment.

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/kundali/generate` | Validates birth details, calculates chart, saves to DB, returns unique ID |
| `GET` | `/api/kundali/:id` | Retrieves saved chart by ID (supports refresh and sharing) |
| `PUT` | `/api/kundali/:id` | Updates birth inputs and recalculates the chart |
| `DELETE` | `/api/kundali/:id` | Deletes the specified chart record |
| `GET` | `/api/locations/search?q=...` | City autocomplete with latitude, longitude, and timezone offset |
| `GET` | `/api/panchang/today` | Real-time Vedic Panchang for date and coordinates |
| `GET` | `/api/horoscope/daily` | Daily Vedic horoscope for all 12 Rashis |
| `POST` | `/api/compatibility/calculate` | 36-Point Ashtakoot Gun Milan matching |

---

## 🧪 Testing & Verification

Run the full end-to-end integration test suite:
```bash
node server/test-api.js
```

Build verification for production:
```bash
npm run build
```

---

## 📜 License & Credits

Created for **Voxigen** — *Discover Your Cosmic Blueprint*.
Vedic astrology algorithms based on classical treatises (Brihat Parashara Hora Shastra) and astronomical models.
