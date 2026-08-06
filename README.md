# PriceBazar

PriceBazar is a modern, responsive price-comparison and marketplace platform built with React and Vite. It allows users to discover products, compare prices, save products to a watchlist, place orders, and complete secure payments. Vendors can publish and manage products and advertisements, while administrators can manage users, products, advertisements, and orders from a role-based dashboard.

Fully Responsive for Mobile, Tablet & Desktop

Client site: https://github.com/Mezbahul-241-15-929/PriceBazar_Client

Server site: https://github.com/Mezbahul-241-15-929/PriceBazar_Server

🌐 Live Site: https://react-tempate.web.app/

## Project Overview

PriceBazar connects buyers, vendors, and administrators in one marketplace experience. Visitors can browse approved products and advertisements, authenticated users can manage their profiles and purchases, vendors can manage their inventory, and administrators can oversee the platform through protected dashboard routes.

## Key Features

- **Authentication:** Firebase email/password authentication, Google sign-in, profile updates, persistent auth state, and logout.
- **Role-based access:** Separate dashboard capabilities for `admin`, `vendor`, and `user` roles with protected routes.
- **Product marketplace:** Browse products, view product details, sort and filter listings, and see product reviews.
- **Vendor tools:** Add, update, delete, and manage products and advertisements.
- **User tools:** Maintain a profile, place orders, review order history, follow price trends, and save products to a watchlist.
- **Admin tools:** Manage users, products, advertisements, and all orders from the admin dashboard.
- **Payments:** Stripe-powered checkout flow for product purchases.
- **Advertisements:** Display marketplace advertisements and provide vendor advertisement management.
- **Secure API communication:** Axios-based API requests with Firebase-authenticated JWT access tokens.
- **Responsive UI:** Mobile-friendly layouts built with Tailwind CSS and DaisyUI, with interactive motion, charts, sliders, notifications, and loading states.

## Tech Stack

- Frontend: React 19
- Build tool: Vite
- Routing: React Router 7
- Styling: Tailwind CSS 4, DaisyUI
- Authentication: Firebase Authentication
- Backend communication: Axios and REST API
- Payments: Stripe
- Forms and UI: React Hook Form, React Hot Toast, SweetAlert2
- Visualizations and interactions: Recharts, Framer Motion, Swiper, Lottie React
- Utilities: React Icons, React Datepicker

## Install & Run Locally

Clone the repository, install dependencies, and start the development server:

```bash
git clone https://github.com/Mezbahul-241-15-929/PriceBazar_Client.git
cd PriceBazar_Client
npm install
npm run dev
```

To create a production build:

```bash
npm run build
npm run preview
```

To run lint checks:

```bash
npm run lint
```

## Environment Variables

Create a `.env.local` file in the project root and provide the Firebase, backend, image-hosting, and Stripe configuration values:

```env
VITE_apiKey=
VITE_authDomain=
VITE_projectId=
VITE_storageBucket=
VITE_messagingSenderId=
VITE_appId=

VITE_image_host_key=
VITE_PAYMENT_KEY=
VITE_SERVER_URL=
```

The Firebase variables are read by `src/firebase/firebase.init.js`. `VITE_SERVER_URL` should point to the PriceBazar backend API, while `VITE_PAYMENT_KEY` is used to initialize Stripe checkout. Do not commit real environment values to source control.

## Main Routes

- `/` - Home page
- `/products` - Product listing
- `/product-details/:id` - Protected product details page
- `/payment/:product_id` - Protected payment page
- `/profile` - Protected user profile
- `/login` - Login page
- `/register` - Registration page
- `/dashboard` - Role-aware dashboard

Dashboard sections are protected according to the signed-in user's role and include user management, product management, advertisements, orders, watchlists, price trends, and vendor tools.

## Project Structure

- `src/` - React application source
- `src/components/` - Reusable sections such as banners, features, advertisements, products, statistics, and loading states
- `src/pages/` - Page-level features including home, products, authentication, profile, and payment
- `src/layouts/` - Root, authentication, and dashboard layouts
- `src/layouts/DashBoardComponents/` - Admin, vendor, and user dashboard modules
- `src/routes/` - Browser routing, private routes, role-based routes, and error handling
- `src/contexts/` - Global authentication context and provider
- `src/hooks/` - Authentication, role, and secure Axios hooks
- `src/firebase/` - Firebase application and authentication initialization
- `public/` - Public assets and static files

## Author

Md. Mezbahul Islam

---

© 2026 PriceBazar. All Rights Reserved.
