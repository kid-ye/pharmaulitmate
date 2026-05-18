# WombAndBeyond Storefront

Full-stack e-commerce application for a medical kits storefront with a live admin dashboard, user accounts, cart, order management, and Shiprocket shipping integration.

## Stack

**Frontend**

- React 19
- Vite 8
- React Router
- Recharts
- Lucide React
- ESLint

**Backend**

- Node.js + Express
- PostgreSQL 16
- JWT authentication
- Multer (file uploads)

**Infrastructure**

- Docker + Docker Compose
- Nginx (frontend serving + API proxy)
- Shiprocket API (shipping)

## Routes

**Storefront**

- `/` — home page with featured products
- `/shop` — product listing with filters and quick-add
- `/about` — store information
- `/contact` — contact form
- `/signin` — customer login and registration
- `/profile` — account, addresses, orders, password (auth required)
- `/cart` — cart and checkout

**Admin**

- `/admin` — protected admin dashboard

## Admin Login

```text
Email: admin@WombAndBeyond.com
Password: admin123
```

Admin authentication uses JWT stored in `localStorage`. The admin dashboard provides:

- Live KPI cards (revenue, orders, products, customers)
- Monthly revenue and category sales charts
- Order management with status updates
- Product management — add, edit, delete with up to 5 image uploads
- Customer list with order counts and spend
- Review moderation (feature/unfeature)

## Customer Accounts

Customers can register and log in at `/signin`. Features:

- Profile editing (name, city, phone)
- Saved addresses (add, edit, delete, set default)
- Order history with Shiprocket shipment tracking
- Password change

## Shiprocket Integration

Orders placed on checkout are automatically pushed to Shiprocket. The following backend endpoints are available (admin JWT required):

| Endpoint                                  | Description                  |
| ----------------------------------------- | ---------------------------- |
| `GET /api/shiprocket/ping`                | Test Shiprocket auth         |
| `GET /api/shiprocket/serviceability`      | Check courier serviceability |
| `POST /api/shiprocket/orders`             | Create Shiprocket order      |
| `POST /api/shiprocket/awb`                | Assign AWB code              |
| `POST /api/shiprocket/pickup`             | Generate pickup request      |
| `POST /api/shiprocket/manifests/generate` | Generate manifest            |
| `POST /api/shiprocket/manifests/print`    | Print manifest PDF           |
| `POST /api/shiprocket/label`              | Generate shipping label PDF  |
| `POST /api/shiprocket/invoice`            | Print invoice PDF            |
| `GET /api/shiprocket/track/:awb`          | Track shipment by AWB        |

## Setup

### With Docker (recommended)

```bash
docker compose up --build -d
```

The app runs at `http://localhost:5173`

### Environment Variables

Create `.env` in the project root:

````text
POSTGRES_DB=WombAndBeyond
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_db_password
```

Create `backend/.env`:

```text
PORT=4000
DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db:5432/${POSTGRES_DB}
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost
SHIPROCKET_URL=https://apiv2.shiprocket.in/v1/external
SHIPROCKET_EMAIL=your_shiprocket_api_user_email
SHIPROCKET_PASSWORD=your_shiprocket_api_password
```

### Local Development (without Docker)

```bash
npm install
npm run dev
```

Backend:

```bash
cd backend
npm install
npm run dev
```

## Project Structure

```text
backend/
  src/
    db/             schema.sql, seed.sql, pool, init
    middleware/     JWT auth middleware
    routes/         auth, users, products, orders, cart, shiprocket, ...
    services/       shiprocket.js (token cache + request helper)
  uploads/          uploaded product images (served at /uploads/)

public/images/      Static SVG product and page assets
src/
  api/client.js     All frontend API calls
  components/       Navbar, Footer, ProductCard, AuthModal
  pages/            Storefront pages (Home, Shop, Cart, Profile, SignIn, ...)
  pages/admin/      Admin Dashboard and Login
  constants.js      Shared brand and commerce constants
```

## Scripts

```bash
npm run dev       # start frontend dev server
npm run build     # production build
npm run lint      # ESLint
npm run preview   # preview production build
```
````
