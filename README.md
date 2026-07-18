# 📚 Varaq (ورق) - Modern E-Commerce Bookstore

![Next.js](https://img.shields.io/badge/Next.js_16-Black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-443E38?style=for-the-badge&logo=react&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![NextAuth.js](https://img.shields.io/badge/Auth.js-000000?style=for-the-badge&logo=auth0&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

Varaq is a full-stack, production-grade e-commerce platform built to demonstrate advanced React, Next.js, and backend architectural patterns. It features a complete shopping experience — from dynamic routing, fuzzy searching, and URL-driven filtering to secure authentication, real-time inventory tracking, cross-device cart synchronization, and a full checkout and payment pipeline — all backed by a dedicated admin dashboard for store management.

🌐 **[Live Demo on Vercel](https://varaq.vercel.app/)**

---

## ✨ Technical Highlights & Features

This project was developed with a strict focus on **Performance, SEO, and Clean Architecture**, simulating a real-world, production-grade full-stack environment powered by a MongoDB database and a secure authentication and payment layer.

### 🚀 Next.js 16 App Router & Server Components

- **Static Site Generation (SSG):** Utilized `generateStaticParams` to pre-render dynamic routes (`/books/[id]` and `/genres/[genre]`) at build time for instant page loads.
- **Streaming & Suspense:** Implemented `loading.tsx` boundaries with custom skeleton loaders to ensure a fluid, non-blocking UI during data fetching.

### 🔍 Advanced URL-Driven Interactivity

- **Server-Side Fuzzy Search:** Integrated `Fuse.js` into Server Actions, combined with a custom `useDebounce` hook, to provide typo-tolerant search without bloating the client bundle.
- **Deep-Linkable Filters:** Built a complex filtering and sorting system (Price, Genres, Sorting) that perfectly synchronizes with the browser's URL via `useSearchParams`, making every specific search state fully shareable and SEO-friendly.

### 🛒 State Management & UI/UX

- **Persistent & Synced Cart:** Managed global cart state using **Zustand**, with local storage persistence for guests and automatic, real-time synchronization to the database for authenticated users — including optimistic UI updates, stock-aware quantity guardrails, and seamless merging across devices and OAuth login flows.
- **Modern UI:** Designed an organic, warm library aesthetic using **Tailwind CSS v4**, featuring "blob" shapes, fluid Framer Motion page transitions, and full Light/Dark mode support.
- **Resilient Assets:** Engineered a custom `BookImage` wrapper around `next/image` to gracefully handle broken external image links with SVG fallbacks.

### 🔐 Authentication & Security

- **Multi-Provider Auth:** A complete authentication system built with **Auth.js (NextAuth v5)**, supporting email/password credentials (hashed with `bcrypt`) as well as Google OAuth, with automatic conflict detection when an email is already registered under a different provider.
- **Role-Based Access Control:** Route-level and server-level protection distinguishing Admin and User roles, enforced through Edge middleware.
- **Anti-Spam Protection:** Integrated **Altcha**, a privacy-first, Proof-of-Work challenge system, to protect authentication forms from bots without relying on invasive CAPTCHAs.
- **Account Management:** A dedicated account settings area lets users securely update their email and password (with current-password verification), with sensible guardrails for accounts authenticated via Google.

### 🏪 Admin Dashboard & Media Management

- **Analytics & Insights:** A real-time analytics dashboard surfacing revenue, active users, and order trends across configurable time ranges, visualized with interactive charts.
- **Inventory Management:** Full CRUD control over the book catalog through a paginated, validated data table.
- **Cloud Asset Pipeline:** Engineered an interactive drag-and-drop image uploader with client-side cropping (`react-easy-crop`). Files are converted to buffers and securely streamed to **Cloudinary** via Server Actions, complete with automated garbage collection for orphaned assets.
- **Order Operations:** Review and update order statuses, inspect customer details, and edit shipping information directly from the admin panel.

### 💳 Checkout, Payments & Order Lifecycle

- **Secure Checkout:** A complete checkout flow integrated with the **Zibal** payment gateway, with pricing always recalculated server-side to prevent client-side tampering.
- **Order Lifecycle Management:** Orders move through a strict state machine (Pending → Paid → Delivered / Cancelled), with automatic cancellation of stale pending orders and self-service repay/cancel actions for users.
- **Shipping Edits:** Users and admins can update shipping details on eligible orders without compromising the integrity of completed or historical orders.

### ⭐ Reviews & User Profiles

- **Profile Dashboard:** A dedicated account area where users can manage personal info, upload custom cropped avatars, and review their order and review history.
- **Book Reviews & Ratings:** Users can leave one review per book; aggregated star ratings are calculated and displayed in real time across the catalog.

### 📦 Real-Time Inventory Awareness

- **Stock-Aware Catalog:** Out-of-stock items are automatically demoted across search, filtering, and recommendation results, while low-stock items are visually flagged to create purchase urgency.
- **Deep-Linkable Stock Filter:** A dedicated toggle lets shoppers browse only in-stock titles.

---

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Database:** MongoDB via **Prisma ORM**
- **Authentication:** Auth.js (NextAuth v5) — Credentials & Google OAuth
- **Styling:** Tailwind CSS v4 & `shadcn/ui` (Radix UI)
- **State Management:** Zustand
- **Media & Storage:** Cloudinary & `react-easy-crop`
- **Search Engine:** Fuse.js
- **Forms & Validation:** `react-hook-form` & Zod
- **Animations:** Framer Motion
- **Charts:** Recharts
- **Payments:** Zibal Payment Gateway
- **Anti-Spam:** Altcha (Proof-of-Work)
- **Contact Form:** Formspree API (Serverless, native fetch)
- **Deployment:** Vercel

---

## ⚙️ Getting Started

To run this project locally:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/nimayaghouti/varaq.git
   cd varaq
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure environment variables:**

   Create a `.env` file in the project root and provide the following essential values:

   ```env
   DATABASE_URL="mongodb+srv://<user>:<password>@cluster.mongodb.net/varaq"
   AUTH_SECRET="your-random-secret-key-generated-by-npx-auth-secret"
   AUTH_GOOGLE_ID="your-google-client-id"
   AUTH_GOOGLE_SECRET="your-google-client-secret"
   CLOUDINARY_URL="cloudinary://<api_key>:<api_secret>@<cloud_name>"
   ```

4. **Set up the database:**

   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server:**

   ```bash
   npm run dev
   ```

6. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

> **Note:** The Zibal payment gateway is pre-configured for sandbox mode, and Altcha securely reuses the AUTH_SECRET for its HMAC key, requiring no additional local configuration.

---

## 🏗️ Architecture Overview

- `app/`: Contains the App Router segments — including the `(auth)`, `(shop)`, `(static)`, and `(user)` route groups, plus a dedicated `admin` section — along with layouts and loading states.
- `components/`: Modular UI pieces categorized into `shared`, `layout`, `admin`, `auth`, and `ui` (shadcn).
- `lib/`: Server-side utilities, Prisma client, Cloudinary SDK wrapper, and data fetching logic.
- `lib/actions/`: Server Actions for authentication, cart syncing, orders, reviews, and admin mutations.
- `lib/validations/`: Zod schemas used across forms and Server Actions.
- `prisma/`: Database schema (`schema.prisma`) and seeding scripts.
- `store/`: Zustand global state configuration.
- `hooks/`: Custom React hooks (e.g., `useDebounce`, `useCart`).
- `auth.ts` / `auth.config.ts` / `proxy.ts`: Authentication configuration and Edge-compatible route protection.

---

_Designed and developed as a technical portfolio project._
