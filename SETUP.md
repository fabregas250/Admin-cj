# Admin Panel Setup Guide

## Backend Setup

### 1. Database Migration

Run the Prisma migration to add AdminUser and ActivityLog models:

```bash
cd backend
npx prisma migrate dev --name add_admin_and_activity_log
```

### 2. Generate Prisma Client

```bash
npx prisma generate
```

### 3. Seed Admin User

Create the default admin user:

```bash
node prisma/seedAdmin.js
```

Default credentials:
- Email: `admin@creditjambo.com`
- Password: `Admin123!`

**⚠️ IMPORTANT: Change the password after first login!**

### 4. Start Backend Server

```bash
npm run dev
```

## Frontend Setup

### 1. Install Dependencies

```bash
cd Admin-cj
npm install
```

### 2. Environment Variables

Create a `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Start Development Server

```bash
npm run dev
```

The admin panel will be available at `http://localhost:5174`

## Features

- ✅ Admin authentication with JWT
- ✅ Role-based access control (RBAC)
- ✅ Dashboard with statistics
- ✅ User management (view, activate/deactivate)
- ✅ Device verification management
- ✅ Account management
- ✅ Push notification sending
- ✅ Activity logs viewing
- ✅ Banking-grade UI

## Admin Roles

- **SUPER_ADMIN**: Full access including admin user management
- **ADMIN**: Full access to users, devices, accounts, notifications
- **SUPPORT**: Read-only access to view data

## API Endpoints

All admin endpoints are prefixed with `/api/admin`:

- `POST /api/admin/auth/login` - Admin login
- `GET /api/admin/dashboard/stats` - Dashboard statistics
- `GET /api/admin/users` - List users
- `PUT /api/admin/users/:id/activate` - Activate user
- `PUT /api/admin/users/:id/deactivate` - Deactivate user
- `GET /api/admin/devices` - List devices
- `PUT /api/admin/devices/:id/verify` - Verify device
- `PUT /api/admin/devices/:id/unverify` - Unverify device
- `GET /api/admin/accounts` - List accounts
- `PUT /api/admin/accounts/:id/activate` - Activate account
- `PUT /api/admin/accounts/:id/deactivate` - Deactivate account
- `POST /api/admin/notifications/push` - Send push notification
- `GET /api/admin/activity-logs` - Get activity logs

