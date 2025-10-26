# Stage-2 Ticket Management System

A modern ticket management system built with **Next.js 15**, **React**, **TypeScript**, and **React Query**, featuring authentication, ticket CRUD operations, and a responsive UI with the Hero UI component library.

---

## Table of Contents


- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Folder Structure](#folder-structure)


---

## Demo

> Add your deployed demo URL here (optional).

---

## Features

- User authentication with JWT access and refresh tokens
- Role-based ticket management
- Create, read, update, delete (CRUD) tickets
- Ticket status and priority management
- Responsive dashboard with statistics
- Skeleton loaders and toast notifications
- Error handling and authorization checks

---

## Tech Stack

- **Next.js 15**
- **React 18+**
- **TypeScript**
- **React Query (TanStack)**
- **Hero UI components**
- **Axios for HTTP requests**
- **JSON file storage (for demo purposes)**
- **ESLint + Prettier**

---

## Getting Started

### Prerequisites

- Node.js >= 20
- npm >= 10 or yarn >= 1.22

### Installation

```bash
# Clone the repository
git clone https://github.com/Demandtech/hng13-stage-2-frontend-react

# Navigate to the project directory
cd stage-2-ticket-system

# Install dependencies
npm install
# or
yarn install
```
```bash
# Run the development server
npm run dev
# or
yarn dev

# Build for production
npm run build
# or
yarn build

# Start the production server
npm start
# or
yarn start

# Run linting
npm run lint
# or
yarn lint
```

# env
JWT_SECRET=your_jwt_secret
REFRESH_SECRET=your_refresh_secret
NEXT_PUBLIC_API_URL=http://localhost:3000/api


