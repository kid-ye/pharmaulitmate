# Pharmer Storefront

React and Vite single-page application for a medical kits storefront with a demo admin dashboard.

## Stack

- React 19
- Vite 8
- React Router
- Recharts
- Lucide React
- ESLint

## Routes

- `/` - storefront home page
- `/shop` - product listing and quick shop modal
- `/about` - project and store information
- `/contact` - contact form and support information
- `/admin` - protected demo admin area

## Admin Demo Login

```text
Email: admin@Pharmer.com
Password: admin123
```

Authentication is client-side only and stored in `localStorage`. It is intended for demo use, not production security.

## Setup

```powershell
npm install
npm run dev
```

On Windows PowerShell, if script execution blocks `npm`, use:

```powershell
npm.cmd install
npm.cmd run dev
```

The development server runs at:

```text
http://localhost:5173/
```

## Scripts

```powershell
npm run dev
npm run build
npm run lint
npm run preview
```

## Project Structure

```text
public/images/          Static SVG product and page assets
src/components/         Shared layout and product components
src/pages/              Storefront pages
src/pages/admin/        Admin login, dashboard, styles, and demo data
src/constants.js        Shared brand and commerce constants
```
