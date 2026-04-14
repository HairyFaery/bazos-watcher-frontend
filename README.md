# BazosWatcher Frontend

Frontendová aplikácia na správu produktov a vyhľadávaní pre BazosWatcher scraper.

## Architektúra

```
┌─────────────────────────────────────────────────────────┐
│  Vercel (Frontend)                                      │
│  ┌─────────────────┐  ┌─────────────────────────────┐   │
│  │  Next.js 16     │  │  Vercel Postgres           │   │
│  │  /products      │◄─┤  • products table           │   │
│  │  /searches      │  │  • search_configs table     │   │
│  └─────────────────┘  └─────────────────────────────┘   │
└────────────────────────────┬──────────────────────────┘
                             │ Čítanie konfigurácií
                             │ Zápis produktov
                             ▼
┌─────────────────────────────────────────────────────────┐
│  BazosWatcher (Scraper)                                 │
│  ┌─────────────────┐  ┌─────────────────────────────┐   │
│  │  Node.js        │──►│  Telegram Bot               │   │
│  │  RSS Parser     │  │  Notifikácie o nových       │   │
│  │  FB Marketplace │  │  inzerátoch a znížených    │   │
│  └─────────────────┘  │  cenách                     │   │
│                       └─────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

## Technológie

- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Vercel Postgres** (databáza)

## Funkcie

- **Produkty** - Zoznam, pridávanie, úprava, mazanie, vyhľadávanie
- **Vyhľadávania** - Správa vyhľadávacích konfigurácií s whitelist/blacklist
- **Telegram notifikácie** - Prichádzajú zo scrapera pri nových inzerátoch

## Lokálny vývoj

### 1. Frontend

```bash
cd bazos-watcher-frontend
npm install
vercel login
vercel link
vercel env pull .env.local
npx tsx scripts/setup-db.ts
npm run dev
```

### 2. Scraper

```bash
cd BazosWatcher
npm install
```

Vytvor `.env` súbor:

```env
TELEGRAM_BOT_TOKEN=your_telegram_token
TELEGRAM_CHAT_ID=your_chat_id
MAX_PRICE_EUR=160

# Postgres connection (skopíruj z Vercel Dashboard)
POSTGRES_URL=postgres://...
POSTGRES_USER=...
POSTGRES_HOST=...
POSTGRES_PASSWORD=...
POSTGRES_DATABASE=...
```

Spusti scraper:

```bash
npm start
```

## Nasadenie na Vercel

### 1. Nasadenie frontendu

```bash
cd bazos-watcher-frontend
vercel
```

V Dashboard > Storage vytvor Postgres databázu a prepoj s projektom.

### 2. Inicializácia databázy

```bash
vercel env pull .env.local
npx tsx scripts/setup-db.ts
vercel --prod
```

### 3. Scraper na serveri

Scraper beží mimo Vercel (napr. na Raspberry Pi, VPS). Potrebuje len prístup k rovnakej databáze.

## Databázové tabuľky

### products

| Stĺpec | Typ | Popis |
|--------|-----|-------|
| id | SERIAL | Primárny kľúč |
| title | VARCHAR(500) | Názov produktu |
| price | DECIMAL | Cena |
| currency | VARCHAR(10) | Mena (EUR, CZK) |
| link | VARCHAR(1000) | URL inzerátu |
| source | VARCHAR(100) | Zdroj (Bazos.sk, FB Marketplace) |
| last_seen | BIGINT | Timestamp posledného videnia |
| created_at | TIMESTAMP | Kedy bol vytvorený |
| updated_at | TIMESTAMP | Kedy bol aktualizovaný |

### search_configs

| Stĺpec | Typ | Popis |
|--------|-----|-------|
| id | SERIAL | Primárny kľúč |
| keyword | VARCHAR(255) | Kľúčové slovo pre vyhľadávanie |
| label | VARCHAR(255) | Popis vyhľadávania |
| max_price | INTEGER | Maximálna cena |
| currency | VARCHAR(10) | Mena |
| whitelist | TEXT | JSON pole slov, ktoré musia byť v názve |
| blacklist | TEXT | JSON pole slov, ktoré nesmú byť v názve |
| locations | TEXT | JSON pole lokácií |
| active | BOOLEAN | Či je vyhľadávanie aktívne |

## API Endpoints

### Produkty

| Metóda | Endpoint | Popis |
|--------|----------|-------|
| GET | `/api/products` | Získať všetky produkty |
| POST | `/api/products` | Vytvoriť nový produkt |
| GET | `/api/products/[id]` | Získať produkt podľa ID |
| PUT | `/api/products/[id]` | Upraviť produkt |
| DELETE | `/api/products/[id]` | Vymazať produkt |

### Vyhľadávania

| Metóda | Endpoint | Popis |
|--------|----------|-------|
| GET | `/api/searches` | Získať všetky vyhľadávania |
| POST | `/api/searches` | Vytvoriť nové vyhľadávanie |
| GET | `/api/searches/[id]` | Získať vyhľadávanie podľa ID |
| PUT | `/api/searches/[id]` | Upraviť vyhľadávanie (vrátane toggle active) |
| DELETE | `/api/searches/[id]` | Vymazať vyhľadávanie |

## Telegram príkazy (scraper)

Keď scraper beží, môžete mu posielať príkazy:

- `/status` - Zobrazí štatistiku sledovaných produktov
- `/list <keyword>` - Zobrazí posledné inzeráty pre kľúčové slovo
- `/searches` - Zobrazí aktívne vyhľadávania
- `/pause` - Pozastaví kontrolu inzerátov
- `/resume` - Obnoví kontrolu inzerátov
- `/help` - Zobrazí nápovedu

## Časový plán scrapera

| Čas | Úloha |
|-----|-------|
| 02:00 | Mazanie starých inzerátov (starších ako 3 týždne) |
| Každých 30 min (5-21h) | RSS kontrola Bazos.sk/cz |
| 00:00 | Nočná RSS kontrola |
| 08:00, 18:00 | FB Marketplace kontrola |

## Štruktúra projektu

```
bazos-watcher-frontend/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── products/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/route.ts
│   │   │   └── searches/
│   │   │       ├── route.ts
│   │   │       └── [id]/route.ts
│   │   ├── searches/page.tsx
│   │   ├── page.tsx
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── Navigation.tsx
│   │   ├── ProductCard.tsx
│   │   ├── ProductList.tsx
│   │   ├── ProductForm.tsx
│   │   ├── SearchBar.tsx
│   │   ├── SearchConfigCard.tsx
│   │   └── SearchConfigForm.tsx
│   └── lib/
│       ├── db.ts
│       └── types.ts
└── scripts/
    └── setup-db.ts

BazosWatcher/
├── index.js          # Upravený scraper s DB podporou
├── INTEGRATION.md    # Dokumentácia integrácie
└── package.json
```
