# Credit Jambo Admin Panel

Professional admin panel for managing Credit Jambo client application with banking-grade UI.

## Features

- **Dashboard**: Real-time analytics and system overview
- **User Management**: View, activate, and deactivate users
- **Device Verification**: Manage and verify client devices
- **Activity Logs**: Comprehensive audit trail
- **Push Notifications**: Send notifications to users
- **Account Management**: Manage user accounts
- **RBAC**: Role-based access control (Super Admin, Admin, Support)

## Tech Stack

- React 19
- Vite
- TailwindCSS
- Zustand (State Management)
- Axios
- Recharts (Charts)
- React Router
- React Hot Toast

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The admin panel will be available at `http://localhost:5174`

### Build

```bash
npm run build
```

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:5000/api
```

## Project Structure

```
src/
├── components/      # Reusable UI components
├── pages/          # Page components
├── services/       # API services
├── store/          # Zustand stores
├── utils/          # Utility functions
└── assets/         # Static assets
```
