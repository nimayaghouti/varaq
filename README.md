# 📚 Varaq (ورق) - Modern E-Commerce Bookstore

![Next.js](https://img.shields.io/badge/Next.js_16-Black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-443E38?style=for-the-badge&logo=react&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

Varaq is a highly optimized, serverless e-commerce frontend application built to demonstrate advanced React and Next.js architectural patterns. It features a fully functional shopping experience with dynamic routing, fuzzy searching, URL-driven filtering, and persistent cart management.

🌐 **([Live Demo on Vercel](https://varaq.vercel.app/))**

---

## ✨ Technical Highlights & Features

This project was developed with a strict focus on **Performance, SEO, and Clean Architecture**, simulating a real-world production environment using a static JSON database hosted on GitHub.

### 🚀 Next.js 16 App Router & Server Components

- **Static Site Generation (SSG):** Utilized `generateStaticParams` to pre-render dynamic routes (`/books/[id]` and `/genres/[genre]`) at build time for instant page loads.
- **Streaming & Suspense:** Implemented `loading.tsx` boundaries with custom skeleton loaders to ensure a fluid, non-blocking UI during data fetching.

### 🔍 Advanced URL-Driven Interactivity

- **Server-Side Fuzzy Search:** Integrated `Fuse.js` into Server Actions, combined with a custom `useDebounce` hook, to provide typo-tolerant search without bloating the client bundle.
- **Deep-Linkable Filters:** Built a complex filtering and sorting system (Price, Genres, Sorting) that perfectly synchronizes with the browser's URL via `useSearchParams`, making every specific search state fully shareable and SEO-friendly.

### 🛒 State Management & UI/UX

- **Persistent Cart:** Managed global cart state using **Zustand** with local storage persistence, elegantly resolving Next.js hydration mismatches using custom derived-state hooks.
- **Modern UI:** Designed an organic, warm library aesthetic using **Tailwind CSS v4**, featuring "blob" shapes, fluid Framer Motion page transitions, and full Light/Dark mode support.
- **Resilient Assets:** Engineered a custom `BookImage` wrapper around `next/image` to gracefully handle broken external image links with SVG fallbacks.

---

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 & `shadcn/ui` (Radix UI)
- **State Management:** Zustand
- **Search Engine:** Fuse.js
- **Animations:** Framer Motion
- **Form Handling:** Formspree API (Serverless, native fetch)
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

3. **Run the development server:**

   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

> **Note:** The application fetches its data from a public GitHub repository. Ensure you have an active internet connection for the initial data fetch.

---

## 🏗️ Architecture Overview

- `app/`: Contains the App Router segments, layouts, and loading states.
- `components/`: Modular UI pieces categorized into `shared`, `layout`, and `ui` (shadcn).
- `lib/data/`: Server-side logic for fetching, filtering, and searching the mock database.
- `store/`: Zustand global state configuration.
- `hooks/`: Custom React hooks (e.g., `useDebounce`, `useCart`).

---

_Designed and developed as a technical portfolio project._
