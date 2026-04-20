<div align="center">

# Kreli

### Plateforme de location de matériel professionnel au Maroc

Fullstack monorepo built with **Next.js 14**, **TypeScript**, **Express**, **MongoDB Atlas**, and **Socket.IO**.

<p>
  <img src="https://img.shields.io/badge/Frontend-Next.js%2014-004e98?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js 14" />
  <img src="https://img.shields.io/badge/Backend-Express-ff6700?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/Database-MongoDB%20Atlas-1a1a2e?style=for-the-badge&logo=mongodb&logoColor=4DB33D" alt="MongoDB Atlas" />
  <img src="https://img.shields.io/badge/Deploy-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
</p>

<p>
  <img src="https://img.shields.io/badge/App%20Router-Enabled-004e98?style=flat-square" alt="App Router" />
  <img src="https://img.shields.io/badge/TypeScript-Strict-004e98?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Auth-JWT-1a1a2e?style=flat-square" alt="JWT Auth" />
  <img src="https://img.shields.io/badge/UI-Figma%20Design-ff6700?style=flat-square" alt="Figma Design" />
</p>

**[Live Demo → loca-mat.vercel.app](https://loca-mat.vercel.app/)**

</div>

---

## Overview

LocaMat is a rental marketplace where users can browse professional equipment, register as renters or owners, and manage their rental activity. Built as a PFE (Projet de Fin d'Études) fullstack application.

---

## Project Structure

```text
kreli/
├── frontend/                  # Next.js 14 App Router + TypeScript + Tailwind CSS
│   └── src/
│       ├── app/
│       │   ├── page.tsx           # Homepage
│       │   ├── catalogue/         # Catalogue with filters + pagination
│       │   ├── materiel/[id]/     # Material detail page
│       │   └── auth/              # Login + Signup
│       ├── components/
│       │   ├── Navbar.tsx
│       │   └── Footer.tsx
│       ├── context/AuthContext.tsx
│       └── lib/api.ts
├── backend/                   # Express 5 + MongoDB Atlas
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middleware/
│       ├── models/
│       ├── routes/
│       └── seeds/
└── docker-compose.yml
```

---

## Tech Stack

### Frontend
- Next.js 14 (App Router)
- React 18 + TypeScript
- Tailwind CSS (Inter font, custom design tokens)
- Lucide React icons

### Backend
- Node.js + Express 5
- MongoDB Atlas + Mongoose
- JWT authentication
- Socket.IO
- multer (file uploads)
- express-validator + express-rate-limit

---

## Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage — hero, categories, featured products, testimonials, CTA |
| `/catalogue` | Filterable catalogue — sidebar filters, product grid, pagination |
| `/materiel/[id]` | Material detail — photos, specs, booking sidebar, similar items |
| `/auth/login` | Login form |
| `/auth/signup` | Registration with role selection (proprietaire / locataire) |

---

## Design

UI implemented from the [location-material-design Figma file](https://www.figma.com/design/j36TdfzLt30mUaz7b4nE91/location-material-design).

Design tokens:

| Token | Value | Usage |
|-------|-------|-------|
| Primary | `#004e98` | Hero bg, navbar accent, owner avatars |
| Brand | `#ff6700` | CTAs, prices, active filters, logo accent |
| Background | `#ebebeb` | Page background |
| Footer | `#1a1a2e` | Footer background |

---

## Authentication

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me`
- `PUT /api/v1/auth/profile`

JWT-based with role support (`proprietaire`, `locataire`, `both`).

---

## Local Setup

### 1. Clone and install

```bash
git clone https://github.com/youssefsina/LocaMat.git
cd LocaMat
cd backend && npm install
cd ../frontend && npm install
```

### 2. Configure environment

`backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/locamat
JWT_SECRET=your_secret_here
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000
```

`frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

### 3. Run

```bash
# Backend
cd backend && npm run dev

# Frontend (separate terminal)
cd frontend && npm run dev
```

Frontend: http://localhost:3000 · Backend: http://localhost:5000

### 4. Seed the database (optional)

```bash
cd backend && npm run seed
```

---

## Deployment

| Service | URL |
|---------|-----|
| Frontend (Vercel) | https://loca-mat.vercel.app/ |
| Backend | Deploy separately on Railway or Render |

---

## Current Status

| Area | Status |
|------|--------|
| Frontend — all pages | Complete |
| Figma design implementation | Complete |
| Backend models + auth API | Complete |
| JWT authentication | Complete |
| Vercel frontend deployment | Live |
| Docker Compose | Ready |
| Real-time (Socket.IO) | Backend ready, frontend pending |

---

<div align="center">

Built for **LocaMat** — PFE 2024

</div>
